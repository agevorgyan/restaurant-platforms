/**
 * Enterprise Kitchen Routing & Production Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, KitchenTicket Aggregate Isolation, Deterministic Station Routing Engine,
 * Course Hold/Fire Timing, Production Queue Balancing, Expo Consolidation Dashboard, and CQRS Read Models.
 */

import { KitchenTicketStatus, StationStatus } from '../src/domain/enums/pos-kitchen-routing.enums';
import {
  CourseTicket,
  KitchenStation,

  ProductionPriority,
} from '../src/domain/value-objects/pos-kitchen-routing-vo';
import {
  CourseTimingService,
  EnterprisePosKitchenRoutingPlatformService,
  ExpoService,
  KitchenRoutingService,
  ProductionQueueService,
  StationAssignmentService,
  TicketLifecycleService,
} from '../src/services/pos-kitchen-routing.services';

describe('Enterprise Kitchen Routing & Production Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format KitchenStation and ProductionPriority correctly', () => {
      const station = KitchenStation.create('Grill 1', 'Grill', StationStatus.BUSY);
      expect(station.name).toBe('Grill 1');
      expect(station.status).toBe(StationStatus.BUSY);

      const prio = ProductionPriority.create(1);
      expect(prio.level).toBe(1);
    });

    it('should format CourseTicket correctly', () => {
      const course = CourseTicket.create(2, 'Main', false);
      expect(course.courseNumber).toBe(2);
      expect(course.isFired).toBe(false);
    });
  });

  describe('KitchenRoutingService & Deterministic Routing', () => {
    let routingService: KitchenRoutingService;

    beforeEach(() => {
      routingService = new KitchenRoutingService();
    });

    it('should deterministically route product categories to designated kitchen stations', () => {
      expect(routingService.determineTargetStation('STEAK')).toBe('Grill Station');
      expect(routingService.determineTargetStation('FRIES')).toBe('Fryer Station');
      expect(routingService.determineTargetStation('PIZZA')).toBe('Pizza Station');
      expect(routingService.determineTargetStation('COCKTAIL')).toBe('Bar Station');
    });
  });

  describe('CourseTimingService & ProductionQueueService', () => {
    let courseTimingService: CourseTimingService;
    let queueService: ProductionQueueService;

    beforeEach(() => {
      courseTimingService = new CourseTimingService();
      queueService = new ProductionQueueService();
    });

    it('should register courses on hold and fire courses on demand', () => {
      const course = courseTimingService.registerCourse('ord-99', 2, 'Main Course', true);
      expect(course.isFired).toBe(false);

      const fireTime = courseTimingService.fireCourse('ord-99', 2);
      expect(fireTime.time).toBeDefined();
    });

    it('should prioritize high priority tickets in queue position calculation', () => {
      const posHigh = queueService.calculateQueuePosition(5, ProductionPriority.create(1));
      expect(posHigh).toBe(1);

      const posNormal = queueService.calculateQueuePosition(5, ProductionPriority.create(2));
      expect(posNormal).toBe(6);
    });
  });

  describe('ExpoService & TicketLifecycleService & Read Models', () => {
    let routingService: KitchenRoutingService;
    let stationAssignmentService: StationAssignmentService;
    let courseTimingService: CourseTimingService;
    let queueService: ProductionQueueService;
    let expoService: ExpoService;
    let ticketLifecycleService: TicketLifecycleService;
    let platformService: EnterprisePosKitchenRoutingPlatformService;

    beforeEach(() => {
      routingService = new KitchenRoutingService();
      stationAssignmentService = new StationAssignmentService();
      courseTimingService = new CourseTimingService();
      queueService = new ProductionQueueService();
      expoService = new ExpoService();
      ticketLifecycleService = new TicketLifecycleService(routingService, expoService);

      platformService = new EnterprisePosKitchenRoutingPlatformService(
        routingService,
        stationAssignmentService,
        courseTimingService,
        queueService,
        expoService,
        ticketLifecycleService
      );
    });

    it('should create kitchen tickets, advance status to READY, and update Expo dashboard', () => {
      const ticketId = ticketLifecycleService.createKitchenTicket('ord-777', 'STEAK', 2, 'Table 5');
      expect(ticketId.id).toBeDefined();

      ticketLifecycleService.updateTicketStatus(ticketId.id, KitchenTicketStatus.PREPARING);
      ticketLifecycleService.updateTicketStatus(ticketId.id, KitchenTicketStatus.READY);

      const queue = ticketLifecycleService.getKitchenQueue();
      expect(queue.totalQueuedTickets).toBe(1);

      const expo = expoService.getExpoDashboard();
      expect(expo.activeOrdersCount).toBe(1);
    });
  });
});
