import { KitchenWorkflowEngine } from '../services/kitchen-workflow.engine';
import { StationAssignmentEngine } from '../services/station-assignment.engine';
import { KitchenQueueManager } from '../services/kitchen-queue.manager';
import { KitchenTimeEstimator } from '../services/kitchen-time.estimator';
import { ProductionScheduler } from '../services/production-scheduler.service';

import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';
import { Production } from '../aggregates/production.aggregate';

import { WorkflowRequest } from '../value-objects/workflow-request.value-object';
import { QueueSnapshot } from '../value-objects/queue-snapshot.value-object';

import { KitchenTicketNumber } from '../value-objects/kitchen-ticket-number.value-object';
import { ProductionNumber } from '../value-objects/production-number.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { ProductionType } from '../enums/production-type.enum';
import { IngredientReference } from '../../../inventory/domain/value-objects/ingredient-reference.value-object';
import { PlannedQuantity } from '../value-objects/planned-quantity.value-object';
import { Quantity } from '../../../inventory/domain/value-objects/quantity.value-object';
import { UnitPrecision } from '../../../inventory/domain/value-objects/unit-precision.value-object';
import { ProductionIngredient } from '../entities/production-ingredient.entity';
import { StationReference } from '../value-objects/station-reference.value-object';
import { OrderItemReference } from '../value-objects/order-item-reference.value-object';
import { KitchenTicketItem } from '../entities/kitchen-ticket-item.entity';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';
import { PreparationTime } from '../value-objects/preparation-time.value-object';

describe('Kitchen Workflow Services', () => {
  const createTestTicket = () => {
    const num = KitchenTicketNumber.create('T-1');
    const rr = RecipeReference.create('r-1', 'CODE', 'Name');
    const sr = StationReference.create('s-1', 'Grill');
    const oir = OrderItemReference.create('o-1', 'oi-1');
    const qty = Quantity.create(1, UnitPrecision.create(0));
    const status = KitchenTicketStatus.create(KitchenTicketStatusEnum.PENDING);
    const duration = PreparationTime.create(5);
    const item = KitchenTicketItem.create('kti-1', oir, rr, qty, status, duration, sr);
    return KitchenTicket.create('t-1', 'o-1', num, [item]);
  };

  const createTestProduction = () => {
    const num = ProductionNumber.create('PROD-100');
    const rr = RecipeReference.create('r-1', 'CODE', 'Name');
    const ir = IngredientReference.create('ing-1', 'CODE');
    const pq = PlannedQuantity.create(Quantity.create(10, UnitPrecision.create(2)));
    const pi = ProductionIngredient.create('pi-1', ir, pq);
    return Production.create('prod-1', num, rr, ProductionType.MANUFACTURING, [pi]);
  };

  describe('KitchenWorkflowEngine', () => {
    let engine: KitchenWorkflowEngine;

    beforeEach(() => {
      engine = new KitchenWorkflowEngine();
    });

    it('should start ticket preparation if valid', () => {
      const ticket = createTestTicket();
      ticket.queue('SYSTEM'); // Move to QUEUED

      const request = WorkflowRequest.create('USER-1', ticket.id);
      const result = engine.startTicketPreparation(ticket, request);

      expect(result.success).toBe(true);
      expect(ticket.status.isInPreparation()).toBe(true);
    });

    it('should fail starting ticket preparation if invalid', () => {
      const ticket = createTestTicket(); // PENDING

      const request = WorkflowRequest.create('USER-1', ticket.id);
      const result = engine.startTicketPreparation(ticket, request);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should start production execution if valid', () => {
      const production = createTestProduction();
      production.schedule('SYSTEM'); // Move to SCHEDULED

      const request = WorkflowRequest.create('USER-1', undefined, production.id);
      const result = engine.startProductionExecution(production, request);

      expect(result.success).toBe(true);
      expect(production.status.isInProgress()).toBe(true);
    });
  });

  describe('StationAssignmentEngine', () => {
    let engine: StationAssignmentEngine;

    beforeEach(() => {
      engine = new StationAssignmentEngine();
    });

    it('should balance assignment', () => {
      const ticket = createTestTicket(); // requests s-1
      const plan = engine.assignTicketToStations(ticket, [
        { stationId: 's-1', currentQueueDepth: 0, maxCapacity: 10 },
        { stationId: 's-2', currentQueueDepth: 0, maxCapacity: 10 }
      ]);

      expect(plan.mappings[0].stationId).toBe('s-1');
    });

    it('should fallback if station full', () => {
      const ticket = createTestTicket(); // requests s-1
      const plan = engine.assignTicketToStations(ticket, [
        { stationId: 's-1', currentQueueDepth: 10, maxCapacity: 10 },
        { stationId: 's-2', currentQueueDepth: 0, maxCapacity: 10 }
      ]);

      expect(plan.mappings[0].stationId).toBe('s-2');
    });
  });

  describe('KitchenQueueManager', () => {
    let manager: KitchenQueueManager;

    beforeEach(() => {
      manager = new KitchenQueueManager();
    });

    it('should balance and sort queue snapshot', () => {
      const earlier = new Date(Date.now() - 10000);
      const snapshot = QueueSnapshot.create('s-1', [
        { id: 't-1', priorityValue: 2, enteredAt: new Date() }, // Normal
        { id: 't-2', priorityValue: 2, enteredAt: earlier }, // Normal but earlier
        { id: 't-3', priorityValue: 1, enteredAt: new Date() } // Rush
      ]);

      const sorted = manager.balanceStationQueue(snapshot);

      expect(sorted[0].id).toBe('t-3'); // Rush first
      expect(sorted[1].id).toBe('t-2'); // Earlier second
      expect(sorted[2].id).toBe('t-1'); // Last
    });
  });

  describe('KitchenTimeEstimator', () => {
    let estimator: KitchenTimeEstimator;
    let manager: KitchenQueueManager;

    beforeEach(() => {
      manager = new KitchenQueueManager();
      estimator = new KitchenTimeEstimator(manager);
    });

    it('should estimate ticket completion based on items and queue delay', () => {
      const ticket = createTestTicket(); // 1 item -> 5 min default
      const snapshot = QueueSnapshot.create('s-1', [
        { id: 'x', priorityValue: 2, enteredAt: new Date() }
      ]); // depth = 1 -> 3 min delay

      const estimate = estimator.estimateTicketCompletion(ticket, [snapshot]);
      
      const expectedTime = new Date();
      expectedTime.setMinutes(expectedTime.getMinutes() + 8); // 5 + 3 = 8
      
      // Allow 1 minute diff in test execution
      const diff = Math.abs(estimate.estimatedAt.getTime() - expectedTime.getTime());
      expect(diff).toBeLessThan(60000);
    });
  });

  describe('ProductionScheduler', () => {
    let scheduler: ProductionScheduler;

    beforeEach(() => {
      scheduler = new ProductionScheduler();
    });

    it('should schedule production', () => {
      const production = createTestProduction();
      scheduler.scheduleProductionBlock(production, 'SYSTEM');
      expect(production.status.isScheduled()).toBe(true);
    });
  });
});
