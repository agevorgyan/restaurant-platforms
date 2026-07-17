import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { KitchenWorkflowState } from './value-objects/kitchen-workflow-state.value-object';
import { PreparationTimePolicy } from './value-objects/preparation-time-policy.value-object';
import { KitchenWorkflowStateMachine } from './services/kitchen-workflow-state-machine.service';
import { validateCreateKitchenWorkflow } from '../application/validation/kitchen-workflow.schema';
import { KitchenWorkflowDomainService } from './services/kitchen-workflow.domain.service';
import { IKitchenWorkflowRepository } from './repositories/kitchen-workflow.repository.interface';

describe('Kitchen Workflow Domain', () => {
  describe('KitchenWorkflowState', () => {
    it('should create valid states', () => {
      assert.doesNotThrow(() => new KitchenWorkflowState('Pending'));
      assert.doesNotThrow(() => new KitchenWorkflowState('Queued'));
      assert.doesNotThrow(() => new KitchenWorkflowState('Preparing'));
      assert.doesNotThrow(() => new KitchenWorkflowState('Paused'));
      assert.doesNotThrow(() => new KitchenWorkflowState('Ready'));
      assert.doesNotThrow(() => new KitchenWorkflowState('Completed'));
      assert.doesNotThrow(() => new KitchenWorkflowState('Cancelled'));
    });

    it('should throw on invalid state', () => {
      assert.throws(() => new KitchenWorkflowState('Invalid' as any), /Invalid workflow state/);
    });

    it('should determine terminal states', () => {
      assert.strictEqual(new KitchenWorkflowState('Completed').isTerminal(), true);
      assert.strictEqual(new KitchenWorkflowState('Cancelled').isTerminal(), true);
      assert.strictEqual(new KitchenWorkflowState('Pending').isTerminal(), false);
      assert.strictEqual(new KitchenWorkflowState('Ready').isTerminal(), false);
    });

    it('should enforce allowed transitions', () => {
      const state = new KitchenWorkflowState('Pending');
      assert.strictEqual(state.canTransitionTo('Queued'), true);
      assert.strictEqual(state.canTransitionTo('Cancelled'), true);
      assert.strictEqual(state.canTransitionTo('Preparing'), false);
    });

    it('should reject transitions from terminal states', () => {
      const state = new KitchenWorkflowState('Completed');
      assert.strictEqual(state.canTransitionTo('Pending'), false);
      
      const cancelled = new KitchenWorkflowState('Cancelled');
      assert.strictEqual(cancelled.canTransitionTo('Ready'), false);
    });
  });

  describe('PreparationTimePolicy', () => {
    it('should create valid policy', () => {
      assert.doesNotThrow(() => new PreparationTimePolicy(10, 15));
    });

    it('should throw on negative expected duration', () => {
      assert.throws(() => new PreparationTimePolicy(-5, 10), /Workflow duration cannot be negative/);
    });

    it('should throw if SLA threshold is less than expected duration', () => {
      assert.throws(() => new PreparationTimePolicy(20, 10), /SLA threshold cannot be less than expected duration/);
    });

    it('should correctly determine SLA exceeded', () => {
      const policy = new PreparationTimePolicy(10, 15);
      assert.strictEqual(policy.isExceeded(10), false);
      assert.strictEqual(policy.isExceeded(15), false);
      assert.strictEqual(policy.isExceeded(16), true);
    });
  });

  describe('KitchenWorkflowStateMachine', () => {
    it('should transition correctly', () => {
      const stateMachine = new KitchenWorkflowStateMachine();
      const workflow: any = {
        state: new KitchenWorkflowState('Pending'),
        updatedAt: new Date()
      };

      stateMachine.transition(workflow, 'Queued');
      assert.strictEqual(workflow.state.value, 'Queued');
    });

    it('should throw on illegal transition', () => {
      const stateMachine = new KitchenWorkflowStateMachine();
      const workflow: any = {
        state: new KitchenWorkflowState('Pending'),
        updatedAt: new Date()
      };

      assert.throws(() => stateMachine.transition(workflow, 'Completed'), /Illegal state transition/);
    });
  });

  describe('Validation', () => {
    it('should validate DTO', () => {
      const errors = validateCreateKitchenWorkflow({
        ticketId: '',
        kitchenId: '',
        expectedDurationMinutes: -1,
        slaThresholdMinutes: -5
      });
      assert.strictEqual(errors.includes('ticketId is required'), true);
      assert.strictEqual(errors.includes('kitchenId is required'), true);
      assert.strictEqual(errors.includes('expectedDurationMinutes must be zero or positive'), true);
      assert.strictEqual(errors.includes('slaThresholdMinutes must be greater than or equal to expected duration'), true);
    });
  });

  describe('Domain Service', () => {
    const mockRepo: IKitchenWorkflowRepository = {
      findById: async () => null,
      save: async () => {}
    };
    const stateMachine = new KitchenWorkflowStateMachine();

    it('should create a valid workflow', async () => {
      const service = new KitchenWorkflowDomainService(mockRepo, stateMachine);
      const workflow = await service.createWorkflow('w1', {
        ticketId: 't1',
        kitchenId: 'k1',
        expectedDurationMinutes: 10,
        slaThresholdMinutes: 15
      });
      assert.strictEqual(workflow.id, 'w1');
      assert.strictEqual(workflow.state.value, 'Pending');
    });
  });
});
