/**
 * Enterprise Guest Service Workflow Platform - Domain Services
 *
 * Implements core domain services for guest service workflow operations:
 * 1. GuestService (Guest Visit Initiation & Stage Lifecycle Coordinator)
 * 2. WaiterAssignmentService (Automatic Load-Balanced & Manual Waiter Assigner)
 * 3. RequestService (Append-Only Guest Request Manager)
 * 4. TableTransferService (Table & Waiter Transfer Coordinator)
 * 5. ServiceTimelineService (Stage Transition Logger & Duration Tracker)
 * 6. VisitLifecycleService (Visit Completion & Feedback Recorder)
 * 7. EnterpriseGuestServiceWorkflowPlatformService (Primary Application Façade)
 */

import { RequestStatus, VisitStatus } from '../domain/enums/guest-service-workflow.enums';

import {
  GuestFeedback,
  GuestRequest,
  GuestVisitId,
  RequestPriority,
  ServiceStage,
  TableTransfer,
  VisitDuration,
  WaiterAssignment,
} from '../domain/value-objects/guest-service-workflow-vo';
import {
  ActiveGuestsReadModel,
  GuestRequestsReadModel,
  ServiceQualityDashboardReadModel,
  ServiceTimelineReadModel,
  WaiterWorkloadReadModel,
} from '../read-models/guest-service-workflow.read-models';

/**
 * Service 1: WaiterAssignmentService
 * Automatic load-balanced & manual waiter section assigner.
 */
export class WaiterAssignmentService {
  private readonly waitersMap = new Map<string, { waiterId: string; waiterName: string; activeTablesCount: number; activeGuestsCount: number }>();

  constructor() {
    this.registerWaiter('w-101', 'Alex Miller');
    this.registerWaiter('w-102', 'Sarah Jenkins');
  }

  public registerWaiter(waiterId: string, waiterName: string): void {
    if (!this.waitersMap.has(waiterId)) {
      this.waitersMap.set(waiterId, { waiterId, waiterName, activeTablesCount: 0, activeGuestsCount: 0 });
    }
  }

  public assignOptimalWaiter(partySize: number, preferredWaiterId?: string): WaiterAssignment {
    if (preferredWaiterId && this.waitersMap.has(preferredWaiterId)) {
      const w = this.waitersMap.get(preferredWaiterId)!;
      w.activeTablesCount += 1;
      w.activeGuestsCount += partySize;
      return WaiterAssignment.create(w.waiterId, w.waiterName);
    }

    // Load-balanced selection: waiter with lowest active tables
    const sorted = Array.from(this.waitersMap.values()).sort((a, b) => a.activeTablesCount - b.activeTablesCount);

    const chosen = sorted[0];
    chosen.activeTablesCount += 1;
    chosen.activeGuestsCount += partySize;
    return WaiterAssignment.create(chosen.waiterId, chosen.waiterName);
  }

  public getWaiterWorkload(): WaiterWorkloadReadModel {
    return {
      waiters: Array.from(this.waitersMap.values()),
    };
  }
}

/**
 * Service 2: RequestService
 * Append-only guest request manager.
 */
export class RequestService {
  private readonly requestsMap = new Map<
    string,
    { requestId: string; guestVisitId: string; tableId: string; requestType: string; priority: RequestPriority; status: RequestStatus; requestedAt: Date }
  >();

  public createRequest(guestVisitId: string, tableId: string, requestType: string, priorityLevel: 'LOW' | 'NORMAL' | 'URGENT' = 'NORMAL'): string {
    const req = GuestRequest.create(requestType, RequestPriority.create(priorityLevel));
    this.requestsMap.set(req.requestId, {
      requestId: req.requestId,
      guestVisitId,
      tableId,
      requestType,
      priority: req.priority,
      status: RequestStatus.PENDING,
      requestedAt: new Date(),
    });
    return req.requestId;
  }

  public completeRequest(requestId: string): void {
    const req = this.requestsMap.get(requestId);
    if (!req) throw new Error(`Request error: Request ${requestId} not found`);
    req.status = RequestStatus.COMPLETED;
  }

  public getGuestRequests(): GuestRequestsReadModel {
    const list = Array.from(this.requestsMap.values());
    const pending = list.filter((r) => r.status === RequestStatus.PENDING || r.status === RequestStatus.IN_PROGRESS);

    return {
      pendingRequestsCount: pending.length,
      requests: list.map((r) => ({
        requestId: r.requestId,
        guestVisitId: r.guestVisitId,
        tableId: r.tableId,
        requestType: r.requestType,
        priority: r.priority.level,
        status: r.status,
        requestedAt: r.requestedAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 3: ServiceTimelineService
 * Stage transition logger & visit duration tracker.
 */
export class ServiceTimelineService {
  private readonly timelineMap = new Map<string, Array<{ stageName: string; timestamp: Date }>>();

  public recordStageTransition(guestVisitId: string, stageName: string): void {
    if (!this.timelineMap.has(guestVisitId)) {
      this.timelineMap.set(guestVisitId, []);
    }
    this.timelineMap.get(guestVisitId)!.push({ stageName, timestamp: new Date() });
  }

  public getServiceTimeline(guestVisitId: string): ServiceTimelineReadModel {
    const list = this.timelineMap.get(guestVisitId) || [];
    return {
      guestVisitId,
      stages: list.map((s) => ({
        stageName: s.stageName,
        timestamp: s.timestamp.toISOString(),
      })),
    };
  }
}

/**
 * Service 4: TableTransferService
 * Table & waiter transfer coordinator.
 */
export class TableTransferService {
  public transferTable(guestVisitId: string, fromTableId: string, toTableId: string): TableTransfer {
    return TableTransfer.create(fromTableId, toTableId);
  }
}

/**
 * Service 5: GuestService
 * Guest visit initiation & stage lifecycle coordinator. Independent from Reservation and Order aggregates.
 */
export class GuestService {
  private readonly visitsMap = new Map<
    string,
    {
      guestVisitId: GuestVisitId;
      guestName: string;
      tableId: string;
      partySize: number;
      waiter: WaiterAssignment;
      status: VisitStatus;
      currentStage: string;
      seatedAt: Date;
    }
  >();

  constructor(
    private readonly waiterAssignmentService: WaiterAssignmentService,
    private readonly timelineService: ServiceTimelineService
  ) {}

  public checkInAndSeatGuest(guestName: string, partySize: number, tableId: string, preferredWaiterId?: string): GuestVisitId {
    const guestVisitId = GuestVisitId.create();
    const waiter = this.waiterAssignmentService.assignOptimalWaiter(partySize, preferredWaiterId);
    const seatedAt = new Date();

    this.visitsMap.set(guestVisitId.id, {
      guestVisitId,
      guestName,
      tableId,
      partySize,
      waiter,
      status: VisitStatus.SEATED,
      currentStage: 'Seated',
      seatedAt,
    });

    this.timelineService.recordStageTransition(guestVisitId.id, 'Seated');
    return guestVisitId;
  }

  public advanceStage(guestVisitId: string, newStageName: string): void {
    const visit = this.visitsMap.get(guestVisitId);
    if (!visit) throw new Error(`Visit error: Guest visit ${guestVisitId} not found`);

    visit.currentStage = newStageName;
    if (newStageName === 'Ordering') visit.status = VisitStatus.ORDERING;
    if (newStageName === 'Dining') visit.status = VisitStatus.DINING;
    if (newStageName === 'Completed') visit.status = VisitStatus.COMPLETED;

    this.timelineService.recordStageTransition(guestVisitId, newStageName);
  }

  public getActiveGuests(): ActiveGuestsReadModel {
    const list = Array.from(this.visitsMap.values()).filter((v) => v.status !== VisitStatus.COMPLETED && v.status !== VisitStatus.CANCELLED);
    return {
      totalActiveVisits: list.length,
      visits: list.map((v) => ({
        guestVisitId: v.guestVisitId.id,
        guestName: v.guestName,
        tableId: v.tableId,
        waiterId: v.waiter.waiterId,
        waiterName: v.waiter.waiterName,
        currentStage: v.currentStage,
        status: v.status,
        seatedAt: v.seatedAt.toISOString(),
        durationMinutes: Math.round((Date.now() - v.seatedAt.getTime()) / 60000),
      })),
    };
  }
}

/**
 * Service 6: VisitLifecycleService
 * Complete guest visit completion & feedback recorder.
 */
export class VisitLifecycleService {
  public completeVisit(guestVisitId: string, ratingStars: number = 5, comments: string = ''): GuestFeedback {
    return GuestFeedback.create(ratingStars, comments);
  }
}

/**
 * Service 7: EnterpriseGuestServiceWorkflowPlatformService
 * High-level application façade for guest service workflow platform infrastructure.
 */
export class EnterpriseGuestServiceWorkflowPlatformService {
  constructor(
    public readonly waiterAssignmentService: WaiterAssignmentService,
    public readonly requestService: RequestService,
    public readonly timelineService: ServiceTimelineService,
    public readonly tableTransferService: TableTransferService,
    public readonly guestService: GuestService,
    public readonly visitLifecycleService: VisitLifecycleService
  ) {}
}
