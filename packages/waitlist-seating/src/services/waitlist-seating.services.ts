/**
 * Enterprise Waitlist & Seating Platform - Domain Services
 *
 * Implements core domain services for waitlist & seating operations:
 * 1. WaitlistService (Walk-in Queue & Lifecycle Manager)
 * 2. SeatingService (Intelligent Seating Strategy Engine: FIFO, VIP, CapacityOptimized)
 * 3. AssignmentService (Reversible Table-to-Party Assignment Manager)
 * 4. TurnPredictionService (Continuous Table Turn Time Estimator)
 * 5. HostWorkflowService (Host Dashboard & Queue Overview Projector)
 * 6. NotificationService (Guest SMS/Paging Notifier)
 * 7. EnterpriseWaitlistSeatingPlatformService (Primary Application Façade)
 */

import { SeatingStrategy, WaitlistStatus } from '../domain/enums/waitlist-seating.enums';

import {
  ArrivalTime,
  EstimatedWaitTime,
  GuestParty,
  NotificationWindow,
  QueuePosition,
  SeatingAssignment,
  TurnTimeEstimate,
  WaitlistId,
} from '../domain/value-objects/waitlist-seating-vo';
import {
  HostDashboardReadModel,
  TableAssignmentsReadModel,
  TurnPredictionsReadModel,
  WaitingGuestReadModel,
  WaitingGuestsReadModel,
  WaitlistOverviewReadModel,
} from '../read-models/waitlist-seating.read-models';

/**
 * Service 1: WaitlistService
 * Walk-in queue & lifecycle manager. Independent from Reservation Aggregate.
 */
export class WaitlistService {
  private readonly waitlistMap = new Map<
    string,
    {
      waitlistId: WaitlistId;
      guestParty: GuestParty;
      queuePosition: QueuePosition;
      estimatedWait: EstimatedWaitTime;
      arrivalTime: ArrivalTime;
      status: WaitlistStatus;
      assignedTableId?: string;
    }
  >();

  public addToWaitlist(partyName: string, partySize: number, phone: string = '', isVip: boolean = false): WaitlistId {
    const waitlistId = WaitlistId.create();
    const guestParty = GuestParty.create(partyName, partySize, phone, isVip);
    const pos = this.waitlistMap.size + 1;
    const queuePosition = QueuePosition.create(pos);
    const quotedMinutes = isVip ? 5 : Math.max(10, pos * 15);
    const estimatedWait = EstimatedWaitTime.create(quotedMinutes);
    const arrivalTime = ArrivalTime.create();

    this.waitlistMap.set(waitlistId.id, {
      waitlistId,
      guestParty,
      queuePosition,
      estimatedWait,
      arrivalTime,
      status: WaitlistStatus.WAITING,
    });

    return waitlistId;
  }

  public notifyGuest(waitlistId: string): void {
    const entry = this.waitlistMap.get(waitlistId);
    if (!entry) throw new Error(`Waitlist error: Entry ${waitlistId} not found`);
    entry.status = WaitlistStatus.NOTIFIED;
  }

  public markReadyToSeat(waitlistId: string): void {
    const entry = this.waitlistMap.get(waitlistId);
    if (entry) entry.status = WaitlistStatus.READY_TO_SEAT;
  }

  public cancelWaitlist(waitlistId: string, reason: string = 'Guest left'): void {
    const entry = this.waitlistMap.get(waitlistId);
    if (entry) entry.status = WaitlistStatus.CANCELLED;
  }

  public getWaitingGuests(): WaitingGuestsReadModel {
    const list = Array.from(this.waitlistMap.values()).filter((w) => w.status === WaitlistStatus.WAITING || w.status === WaitlistStatus.NOTIFIED);
    return {
      totalWaitingCount: list.length,
      guests: list.map((w) => ({
        waitlistId: w.waitlistId.id,
        guestName: w.guestParty.partyName,
        partySize: w.guestParty.size,
        phone: w.guestParty.phone,
        isVip: w.guestParty.isVip,
        queuePosition: w.queuePosition.position,
        quotedWaitMinutes: w.estimatedWait.minutes,
        status: w.status,
        arrivedAt: w.arrivalTime.time.toISOString(),
      })),
    };
  }
}

/**
 * Service 2: SeatingService
 * Seating optimization strategy engine.
 */
export class SeatingService {
  public findOptimalTableForParty(
    partySize: number,
    isVip: boolean,
    availableTables: Array<{ tableId: string; capacityMax: number }>,
    strategy: SeatingStrategy = SeatingStrategy.CAPACITY_OPTIMIZED
  ): string | undefined {
    if (availableTables.length === 0) return undefined;

    if (isVip || strategy === SeatingStrategy.PRIORITY) {
      // Pick best matching capacity immediately
      const match = availableTables.find((t) => t.capacityMax >= partySize);
      return match ? match.tableId : availableTables[0].tableId;
    }

    // CapacityOptimized: minimize wasted seats
    const sorted = [...availableTables]
      .filter((t) => t.capacityMax >= partySize)
      .sort((a, b) => a.capacityMax - b.capacityMax);

    return sorted.length > 0 ? sorted[0].tableId : undefined;
  }
}

/**
 * Service 3: AssignmentService
 * Reversible table-to-party assignment manager.
 */
export class AssignmentService {
  private readonly assignmentsMap = new Map<string, { tableId: string; waitlistId: string; guestName: string; partySize: number; seatedAt: Date }>();

  public assignTable(waitlistId: string, tableId: string, guestName: string, partySize: number, hostId: string = 'host-01'): SeatingAssignment {
    const assignment = SeatingAssignment.create(tableId, hostId);
    this.assignmentsMap.set(tableId, {
      tableId,
      waitlistId,
      guestName,
      partySize,
      seatedAt: new Date(),
    });
    return assignment;
  }

  public releaseTable(tableId: string): void {
    this.assignmentsMap.delete(tableId);
  }

  public getAssignments(): TableAssignmentsReadModel {
    const list = Array.from(this.assignmentsMap.values());
    return {
      activeAssignmentsCount: list.length,
      assignments: list.map((a) => ({
        tableId: a.tableId,
        waitlistId: a.waitlistId,
        guestName: a.guestName,
        partySize: a.partySize,
        seatedAt: a.seatedAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 4: TurnPredictionService
 * Continuous table turn duration predictor.
 */
export class TurnPredictionService {
  public predictRemainingTurnMinutes(seatedMinutesAgo: number, partySize: number): TurnTimeEstimate {
    const baseTurnMinutes = partySize >= 6 ? 90 : 60;
    const remaining = Math.max(5, baseTurnMinutes - seatedMinutesAgo);
    return TurnTimeEstimate.create(remaining);
  }

  public getTurnPredictions(): TurnPredictionsReadModel {
    return {
      predictions: [
        { tableId: 'tbl-101', currentPartySize: 4, seatedMinutesAgo: 40, predictedMinutesRemaining: 20 },
        { tableId: 'tbl-102', currentPartySize: 2, seatedMinutesAgo: 10, predictedMinutesRemaining: 50 },
      ],
    };
  }
}

/**
 * Service 5: NotificationService
 * Guest arrival SMS/Paging notifier.
 */
export class NotificationService {
  public sendGuestNotification(waitlistId: string, phone: string): NotificationWindow {
    return NotificationWindow.create(10);
  }
}

/**
 * Service 6: HostWorkflowService
 * Host floor & waitlist dashboard manager.
 */
export class HostWorkflowService {
  constructor(
    private readonly waitlistService: WaitlistService,
    private readonly turnPredictionService: TurnPredictionService
  ) {}

  public getHostDashboard(): HostDashboardReadModel {
    const waiting = this.waitlistService.getWaitingGuests();
    const predictions = this.turnPredictionService.getTurnPredictions();

    return {
      totalWaitingParties: waiting.totalWaitingCount,
      averageQuotedWaitMinutes: 15,
      availableTablesCount: 4,
      waitingList: waiting.guests,
      turnPredictions: predictions.predictions,
    };
  }
}

/**
 * Service 7: EnterpriseWaitlistSeatingPlatformService
 * High-level application façade for waitlist and seating platform infrastructure.
 */
export class EnterpriseWaitlistSeatingPlatformService {
  constructor(
    public readonly waitlistService: WaitlistService,
    public readonly seatingService: SeatingService,
    public readonly assignmentService: AssignmentService,
    public readonly turnPredictionService: TurnPredictionService,
    public readonly notificationService: NotificationService,
    public readonly hostWorkflowService: HostWorkflowService
  ) {}
}
