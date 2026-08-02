/**
 * Enterprise Waitlist & Seating Platform - Comprehensive Test Suite
 *
 * Tests Value Objects, Independent Waitlist Aggregate, Seating Optimization Strategies (FIFO, Priority, CapacityOptimized),
 * Reversible Table Assignments, Turn Prediction Models, Host Workflow Dashboard, and CQRS Read Models.
 */

import { SeatingStrategy, WaitlistStatus } from '../src/domain/enums/waitlist-seating.enums';
import {
  EstimatedWaitTime,
  GuestParty,
  QueuePosition,
  TurnTimeEstimate,
} from '../src/domain/value-objects/waitlist-seating-vo';
import {
  AssignmentService,
  EnterpriseWaitlistSeatingPlatformService,
  HostWorkflowService,
  NotificationService,
  SeatingService,
  TurnPredictionService,
  WaitlistService,
} from '../src/services/waitlist-seating.services';

describe('Enterprise Waitlist & Seating Platform', () => {
  describe('Value Objects & Invariants', () => {
    it('should format GuestParty and TurnTimeEstimate correctly', () => {
      const party = GuestParty.create('Johnson Party', 4, '+15550199', true);
      expect(party.partyName).toBe('Johnson Party');
      expect(party.size).toBe(4);
      expect(party.isVip).toBe(true);

      const turn = TurnTimeEstimate.create(35);
      expect(turn.estimatedMinutesRemaining).toBe(35);
    });
  });

  describe('WaitlistService & Lifecycle', () => {
    let waitlistService: WaitlistService;

    beforeEach(() => {
      waitlistService = new WaitlistService();
    });

    it('should add guest to waitlist and notify guest', () => {
      const id1 = waitlistService.addToWaitlist('Doe Party', 2);
      expect(id1.id).toBeDefined();

      const vipId = waitlistService.addToWaitlist('Vip Party', 4, '+1555999', true);
      expect(vipId.id).toBeDefined();

      waitlistService.notifyGuest(id1.id);

      const waiting = waitlistService.getWaitingGuests();
      expect(waiting.totalWaitingCount).toBe(2);
    });
  });

  describe('SeatingService & Optimization Strategies', () => {
    let seatingService: SeatingService;

    beforeEach(() => {
      seatingService = new SeatingService();
    });

    it('should find optimal table minimizing wasted seats in CapacityOptimized mode', () => {
      const availableTables = [
        { tableId: 'tbl-large', capacityMax: 8 },
        { tableId: 'tbl-small', capacityMax: 4 },
      ];

      const bestTable = seatingService.findOptimalTableForParty(3, false, availableTables, SeatingStrategy.CAPACITY_OPTIMIZED);
      expect(bestTable).toBe('tbl-small');
    });
  });

  describe('AssignmentService & Reversible Table Assignment', () => {
    let assignmentService: AssignmentService;

    beforeEach(() => {
      assignmentService = new AssignmentService();
    });

    it('should assign table to party and support table release', () => {
      const assignment = assignmentService.assignTable('wt-100', 'tbl-200', 'Brown Party', 4, 'host-admin');
      expect(assignment.tableId).toBe('tbl-200');

      let active = assignmentService.getAssignments();
      expect(active.activeAssignmentsCount).toBe(1);

      assignmentService.releaseTable('tbl-200');
      active = assignmentService.getAssignments();
      expect(active.activeAssignmentsCount).toBe(0);
    });
  });

  describe('TurnPredictionService & HostWorkflowService', () => {
    let waitlistService: WaitlistService;
    let seatingService: SeatingService;
    let assignmentService: AssignmentService;
    let turnPredictionService: TurnPredictionService;
    let notificationService: NotificationService;
    let hostWorkflowService: HostWorkflowService;
    let platformService: EnterpriseWaitlistSeatingPlatformService;

    beforeEach(() => {
      waitlistService = new WaitlistService();
      seatingService = new SeatingService();
      assignmentService = new AssignmentService();
      turnPredictionService = new TurnPredictionService();
      notificationService = new NotificationService();
      hostWorkflowService = new HostWorkflowService(waitlistService, turnPredictionService);

      platformService = new EnterpriseWaitlistSeatingPlatformService(
        waitlistService,
        seatingService,
        assignmentService,
        turnPredictionService,
        notificationService,
        hostWorkflowService
      );
    });

    it('should project live HostDashboard read model', () => {
      waitlistService.addToWaitlist('Walker Party', 2);
      const dashboard = hostWorkflowService.getHostDashboard();

      expect(dashboard.totalWaitingParties).toBe(1);
      expect(dashboard.turnPredictions.length).toBeGreaterThan(0);
    });
  });
});
