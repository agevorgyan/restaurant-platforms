/**
 * Enterprise Kitchen Routing & Production Platform - Domain Services
 *
 * Implements core domain services for kitchen routing:
 * 1. KitchenRoutingService (Deterministic Category-to-Station Routing Engine)
 * 2. StationAssignmentService (Station Workload Distribution & Availability Validator)
 * 3. CourseTimingService (Course Hold & Fire Trigger Manager)
 * 4. ProductionQueueService (Station Queue Positioning & Priority Balancer)
 * 5. ExpoService (Expeditor Consolidation & Order Readiness Coordinator)
 * 6. TicketLifecycleService (KitchenTicket Aggregate Coordinator)
 * 7. EnterprisePosKitchenRoutingPlatformService (Primary Application Façade)
 */

import { KitchenTicketStatus, StationStatus } from '../domain/enums/pos-kitchen-routing.enums';

import {
  CourseTicket,
  FireTime,
  KitchenStation,
  KitchenTicketId,
  ProductionPriority,
  ProductionStationId,
} from '../domain/value-objects/pos-kitchen-routing-vo';
import {
  ExpoDashboardReadModel,
  KitchenQueueReadModel,
  KitchenStatisticsReadModel,
  StationOverviewReadModel,
} from '../read-models/pos-kitchen-routing.read-models';

/**
 * Service 1: KitchenRoutingService
 * Deterministic category-to-station routing engine.
 */
export class KitchenRoutingService {
  private readonly routingRules = new Map<string, string>([
    ['STEAK', 'Grill Station'],
    ['BURGER', 'Grill Station'],
    ['FRIES', 'Fryer Station'],
    ['PIZZA', 'Pizza Station'],
    ['SALAD', 'Salad Station'],
    ['COCKTAIL', 'Bar Station'],
    ['ESPRESSO', 'Coffee Station'],
  ]);

  public determineTargetStation(productCategory: string): string {
    const categoryUpper = productCategory.toUpperCase();
    return this.routingRules.get(categoryUpper) || 'Grill Station';
  }
}

/**
 * Service 2: StationAssignmentService
 * Station availability & workload distribution validator.
 */
export class StationAssignmentService {
  private readonly stations = new Map<string, KitchenStation>();

  constructor() {
    this.seedDefaultStations();
  }

  public getStationOverview(): StationOverviewReadModel[] {
    const list = Array.from(this.stations.values());
    return list.map((s) => ({
      stationId: s.stationId.id,
      stationName: s.name,
      stationType: s.type,
      status: s.status,
      activeTicketsCount: s.status === StationStatus.BUSY ? 4 : 1,
    }));
  }

  private seedDefaultStations(): void {
    const s1 = KitchenStation.create('Grill Station', 'Grill', StationStatus.BUSY);
    const s2 = KitchenStation.create('Fryer Station', 'Fryer', StationStatus.IDLE);
    const s3 = KitchenStation.create('Expo Station', 'Expo', StationStatus.IDLE);
    this.stations.set(s1.stationId.id, s1);
    this.stations.set(s2.stationId.id, s2);
    this.stations.set(s3.stationId.id, s3);
  }
}

/**
 * Service 3: CourseTimingService
 * Course hold & fire trigger manager (`Hold`, `Fire On Demand`).
 */
export class CourseTimingService {
  private readonly courseStateMap = new Map<string, CourseTicket[]>();

  public registerCourse(orderId: string, courseNumber: number, courseName: string, hold: boolean = false): CourseTicket {
    const ticket = CourseTicket.create(courseNumber, courseName, !hold);
    if (!this.courseStateMap.has(orderId)) {
      this.courseStateMap.set(orderId, []);
    }
    this.courseStateMap.get(orderId)!.push(ticket);
    return ticket;
  }

  public fireCourse(orderId: string, courseNumber: number): FireTime {
    const courses = this.courseStateMap.get(orderId) || [];
    const target = courses.find((c) => c.courseNumber === courseNumber);
    if (target) {
      (target as any).isFired = true;
    }
    return FireTime.now();
  }
}

/**
 * Service 4: ProductionQueueService
 * Station queue positioning & priority balancer.
 */
export class ProductionQueueService {
  public calculateQueuePosition(stationTicketsCount: number, priority: ProductionPriority): number {
    if (priority.level === 1) return 1; // High priority skips to top
    return stationTicketsCount + 1;
  }
}

/**
 * Service 5: ExpoService
 * Expeditor consolidation & order readiness coordinator.
 */
export class ExpoService {
  private readonly orderCompletionTracker = new Map<
    string,
    { orderId: string; tableNo?: string; totalStations: number; completedStations: number }
  >();

  public registerOrderForExpo(orderId: string, tableNo?: string, totalStationsCount: number = 2): void {
    this.orderCompletionTracker.set(orderId, {
      orderId,
      tableNo,
      totalStations: totalStationsCount,
      completedStations: 0,
    });
  }

  public markStationComplete(orderId: string): void {
    const tracker = this.orderCompletionTracker.get(orderId);
    if (tracker) {
      tracker.completedStations = Math.min(tracker.totalStations, tracker.completedStations + 1);
    }
  }

  public getExpoDashboard(): ExpoDashboardReadModel {
    const list = Array.from(this.orderCompletionTracker.values());
    const readyForPickupCount = list.filter((o) => o.completedStations === o.totalStations).length;

    return {
      activeOrdersCount: list.length,
      ordersReadyForPickup: readyForPickupCount,
      consolidatedTickets: list.map((o) => ({
        orderId: o.orderId,
        tableNo: o.tableNo,
        totalStations: o.totalStations,
        completedStations: o.completedStations,
        isFullyReady: o.completedStations === o.totalStations,
      })),
    };
  }
}

/**
 * Service 6: TicketLifecycleService
 * Primary KitchenTicket Aggregate coordinator.
 */
export class TicketLifecycleService {
  private readonly ticketStore = new Map<
    string,
    {
      ticketId: KitchenTicketId;
      orderId: string;
      tableNo?: string;
      stationName: string;
      itemsCount: number;
      status: KitchenTicketStatus;
      queuedAt: Date;
    }
  >();

  constructor(
    private readonly routingService: KitchenRoutingService,
    private readonly expoService: ExpoService
  ) {}

  public createKitchenTicket(orderId: string, productCategory: string, itemsCount: number = 1, tableNo?: string): KitchenTicketId {
    const ticketId = KitchenTicketId.create();
    const stationName = this.routingService.determineTargetStation(productCategory);

    this.ticketStore.set(ticketId.id, {
      ticketId,
      orderId,
      tableNo,
      stationName,
      itemsCount,
      status: KitchenTicketStatus.QUEUED,
      queuedAt: new Date(),
    });

    this.expoService.registerOrderForExpo(orderId, tableNo, 2);
    return ticketId;
  }

  public updateTicketStatus(ticketId: string, newStatus: KitchenTicketStatus): void {
    const tkt = this.ticketStore.get(ticketId);
    if (!tkt) throw new Error(`Kitchen error: Ticket ${ticketId} not found`);
    tkt.status = newStatus;

    if (newStatus === KitchenTicketStatus.READY) {
      this.expoService.markStationComplete(tkt.orderId);
    }
  }

  public getKitchenQueue(): KitchenQueueReadModel {
    const list = Array.from(this.ticketStore.values());
    return {
      totalQueuedTickets: list.length,
      tickets: list.map((t) => ({
        ticketId: t.ticketId.id,
        orderId: t.orderId,
        tableNo: t.tableNo,
        stationName: t.stationName,
        itemsCount: t.itemsCount,
        status: t.status,
        queuedAt: t.queuedAt.toISOString(),
      })),
    };
  }
}

/**
 * Service 7: EnterprisePosKitchenRoutingPlatformService
 * High-level application façade for kitchen routing platform infrastructure.
 */
export class EnterprisePosKitchenRoutingPlatformService {
  constructor(
    public readonly routingService: KitchenRoutingService,
    public readonly stationAssignmentService: StationAssignmentService,
    public readonly courseTimingService: CourseTimingService,
    public readonly queueService: ProductionQueueService,
    public readonly expoService: ExpoService,
    public readonly ticketLifecycleService: TicketLifecycleService
  ) {}
}
