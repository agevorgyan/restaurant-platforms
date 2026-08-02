/**
 * Enterprise Guest Service Workflow Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Independent GuestVisit Aggregate, Configurable Service Stage Progression,
 * Load-Balanced Waiter Assignments, Append-Only Guest Requests, Table Transfers, Service Timelines, and CQRS Read Models.
 */

import { RequestStatus, VisitStatus } from '../src/domain/enums/guest-service-workflow.enums';
import {
  GuestFeedback,
  GuestRequest,
  RequestPriority,
  ServiceStage,
  TableTransfer,
} from '../src/domain/value-objects/guest-service-workflow-vo';
import {
  EnterpriseGuestServiceWorkflowPlatformService,
  GuestService,
  RequestService,
  ServiceTimelineService,
  TableTransferService,
  VisitLifecycleService,
  WaiterAssignmentService,
} from '../src/services/guest-service-workflow.services';

describe('Enterprise Guest Service Workflow Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format GuestRequest and GuestFeedback correctly', () => {
      const req = GuestRequest.create('Water', RequestPriority.create('NORMAL'));
      expect(req.requestType).toBe('Water');
      expect(req.priority.level).toBe('NORMAL');

      const fb = GuestFeedback.create(5, 'Excellent service!');
      expect(fb.ratingStars).toBe(5);
      expect(fb.comments).toBe('Excellent service!');
    });
  });

  describe('WaiterAssignmentService & Load Balancing', () => {
    let waiterAssignmentService: WaiterAssignmentService;

    beforeEach(() => {
      waiterAssignmentService = new WaiterAssignmentService();
    });

    it('should automatically assign table to waiter with lowest workload', () => {
      const assignment1 = waiterAssignmentService.assignOptimalWaiter(4);
      expect(assignment1.waiterId).toBe('w-101');

      const assignment2 = waiterAssignmentService.assignOptimalWaiter(2);
      expect(assignment2.waiterId).toBe('w-102');

      const workload = waiterAssignmentService.getWaiterWorkload();
      expect(workload.waiters.length).toBe(2);
    });
  });

  describe('RequestService & Append-Only Requests', () => {
    let requestService: RequestService;

    beforeEach(() => {
      requestService = new RequestService();
    });

    it('should create append-only guest request and mark completed', () => {
      const reqId = requestService.createRequest('vst-1', 'tbl-5', 'Extra Cutlery', 'NORMAL');
      expect(reqId).toBeDefined();

      let requests = requestService.getGuestRequests();
      expect(requests.pendingRequestsCount).toBe(1);

      requestService.completeRequest(reqId);
      requests = requestService.getGuestRequests();
      expect(requests.pendingRequestsCount).toBe(0);
    });
  });

  describe('GuestService & Stage Progression & Timeline', () => {
    let waiterAssignmentService: WaiterAssignmentService;
    let timelineService: ServiceTimelineService;
    let guestService: GuestService;

    beforeEach(() => {
      waiterAssignmentService = new WaiterAssignmentService();
      timelineService = new ServiceTimelineService();
      guestService = new GuestService(waiterAssignmentService, timelineService);
    });

    it('should check in guest, advance service stages, and log service timeline', () => {
      const visitId = guestService.checkInAndSeatGuest('Taylor Party', 4, 'tbl-12');
      expect(visitId.id).toBeDefined();

      guestService.advanceStage(visitId.id, 'Menu Presented');
      guestService.advanceStage(visitId.id, 'Order Taken');
      guestService.advanceStage(visitId.id, 'Dining');

      const active = guestService.getActiveGuests();
      expect(active.totalActiveVisits).toBe(1);
      expect(active.visits[0].currentStage).toBe('Dining');

      const timeline = timelineService.getServiceTimeline(visitId.id);
      expect(timeline.stages.length).toBe(4);
    });
  });

  describe('TableTransferService & EnterpriseGuestServiceWorkflowPlatformService', () => {
    let waiterAssignmentService: WaiterAssignmentService;
    let requestService: RequestService;
    let timelineService: ServiceTimelineService;
    let tableTransferService: TableTransferService;
    let guestService: GuestService;
    let visitLifecycleService: VisitLifecycleService;
    let platformService: EnterpriseGuestServiceWorkflowPlatformService;

    beforeEach(() => {
      waiterAssignmentService = new WaiterAssignmentService();
      requestService = new RequestService();
      timelineService = new ServiceTimelineService();
      tableTransferService = new TableTransferService();
      guestService = new GuestService(waiterAssignmentService, timelineService);
      visitLifecycleService = new VisitLifecycleService();

      platformService = new EnterpriseGuestServiceWorkflowPlatformService(
        waiterAssignmentService,
        requestService,
        timelineService,
        tableTransferService,
        guestService,
        visitLifecycleService
      );
    });

    it('should transfer table and record visit completion feedback', () => {
      const transfer = tableTransferService.transferTable('vst-900', 'tbl-1', 'tbl-2');
      expect(transfer.fromTableId).toBe('tbl-1');
      expect(transfer.toTableId).toBe('tbl-2');

      const fb = visitLifecycleService.completeVisit('vst-900', 5, 'Great dining experience');
      expect(fb.ratingStars).toBe(5);
    });
  });
});
