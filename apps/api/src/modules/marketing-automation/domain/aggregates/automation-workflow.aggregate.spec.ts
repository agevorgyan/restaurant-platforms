import { AutomationWorkflow } from './automation-workflow.aggregate';
import { WorkflowId } from '../value-objects/workflow-id.value-object';
import { WorkflowName } from '../value-objects/workflow-name.value-object';
import { WorkflowPriority } from '../value-objects/workflow-priority.value-object';
import { WorkflowExecutionMode, WorkflowExecutionModeEnum } from '../value-objects/workflow-execution-mode.value-object';
import { WorkflowStatusEnum } from '../value-objects/workflow-status.value-object';
import { WorkflowTrigger, TriggerType } from '../entities/workflow-trigger.entity';
import { WorkflowStep } from '../entities/workflow-step.entity';
import { WorkflowAction, ActionType } from '../entities/workflow-action.entity';

describe('AutomationWorkflow Aggregate', () => {
  let workflowId: WorkflowId;
  let name: WorkflowName;
  let priority: WorkflowPriority;
  let executionMode: WorkflowExecutionMode;
  let trigger: WorkflowTrigger;
  let action: WorkflowAction;
  let step: WorkflowStep;

  beforeEach(() => {
    workflowId = WorkflowId.create('wf-1');
    name = WorkflowName.create('Welcome Campaign');
    priority = WorkflowPriority.create(1);
    executionMode = WorkflowExecutionMode.create(WorkflowExecutionModeEnum.SEQUENTIAL);
    
    trigger = WorkflowTrigger.create('trig-1', TriggerType.CUSTOMER_REGISTERED);
    action = WorkflowAction.create('act-1', ActionType.ASSIGN_COUPON, { couponId: 'c-1' });
    step = WorkflowStep.createActionStep('step-1', 'Give Welcome Coupon', action);
  });

  describe('Creation', () => {
    it('should create a valid workflow in Draft status', () => {
      const workflow = AutomationWorkflow.create(workflowId, name, priority, executionMode);
      
      expect(workflow.workflowId.value).toBe('wf-1');
      expect(workflow.name.value).toBe('Welcome Campaign');
      expect(workflow.status.value).toBe(WorkflowStatusEnum.DRAFT);
      expect(workflow.triggers.length).toBe(0);
      expect(workflow.steps.length).toBe(0);
      expect(workflow.domainEvents.length).toBe(1);
      expect(workflow.domainEvents[0].constructor.name).toBe('WorkflowCreated');
    });
  });

  describe('Triggers Management', () => {
    let workflow: AutomationWorkflow;

    beforeEach(() => {
      workflow = AutomationWorkflow.create(workflowId, name, priority, executionMode);
    });

    it('should add a trigger successfully', () => {
      workflow.addTrigger(trigger);
      expect(workflow.triggers.length).toBe(1);
    });

    it('should prevent adding duplicate triggers of the same type', () => {
      workflow.addTrigger(trigger);
      expect(() => workflow.addTrigger(WorkflowTrigger.create('trig-2', TriggerType.CUSTOMER_REGISTERED)))
        .toThrow('A trigger of type CustomerRegistered already exists');
    });

    it('should remove a trigger successfully', () => {
      workflow.addTrigger(trigger);
      workflow.removeTrigger('trig-1');
      expect(workflow.triggers.length).toBe(0);
    });
  });

  describe('Steps & Graph Management', () => {
    let workflow: AutomationWorkflow;

    beforeEach(() => {
      workflow = AutomationWorkflow.create(workflowId, name, priority, executionMode);
    });

    it('should add a step successfully', () => {
      workflow.addStep(step);
      expect(workflow.steps.length).toBe(1);
    });

    it('should prevent adding a cyclic dependency', () => {
      const stepA = WorkflowStep.createActionStep('step-A', 'A', action, ['step-B']);
      const stepB = WorkflowStep.createActionStep('step-B', 'B', action, ['step-A']);
      
      workflow.addStep(stepA);
      expect(() => workflow.addStep(stepB)).toThrow('Adding this step would create a cyclic dependency');
    });

    it('should remove a step and its references', () => {
      const stepA = WorkflowStep.createActionStep('step-A', 'A', action, ['step-B']);
      const stepB = WorkflowStep.createActionStep('step-B', 'B', action, []);
      
      workflow.addStep(stepA);
      workflow.addStep(stepB);
      
      expect(workflow.steps.find(s => s.id === 'step-A')?.nextStepIds.includes('step-B')).toBe(true);
      
      workflow.removeStep('step-B');
      
      expect(workflow.steps.length).toBe(1);
      expect(workflow.steps.find(s => s.id === 'step-A')?.nextStepIds.includes('step-B')).toBe(false);
    });
  });

  describe('Activation', () => {
    let workflow: AutomationWorkflow;

    beforeEach(() => {
      workflow = AutomationWorkflow.create(workflowId, name, priority, executionMode);
    });

    it('should fail activation if no triggers exist', () => {
      workflow.addStep(step);
      expect(() => workflow.activate()).toThrow('Workflow must contain at least one trigger to be activated');
    });

    it('should fail activation if no actions exist', () => {
      workflow.addTrigger(trigger);
      expect(() => workflow.activate()).toThrow('Workflow must contain at least one action step to be activated');
    });

    it('should activate successfully when valid', () => {
      workflow.addTrigger(trigger);
      workflow.addStep(step);
      workflow.activate();
      
      expect(workflow.status.value).toBe(WorkflowStatusEnum.ACTIVE);
      expect(workflow.domainEvents.some(e => e.constructor.name === 'WorkflowActivated')).toBe(true);
    });
  });

  describe('Lifecycle', () => {
    let workflow: AutomationWorkflow;

    beforeEach(() => {
      workflow = AutomationWorkflow.create(workflowId, name, priority, executionMode);
      workflow.addTrigger(trigger);
      workflow.addStep(step);
      workflow.activate();
    });

    it('should pause and resume an active workflow', () => {
      workflow.pause();
      expect(workflow.status.value).toBe(WorkflowStatusEnum.PAUSED);
      expect(workflow.domainEvents.some(e => e.constructor.name === 'WorkflowPaused')).toBe(true);
      
      workflow.resume();
      expect(workflow.status.value).toBe(WorkflowStatusEnum.ACTIVE);
      expect(workflow.domainEvents.some(e => e.constructor.name === 'WorkflowResumed')).toBe(true);
    });

    it('should archive a workflow', () => {
      workflow.archive();
      expect(workflow.status.value).toBe(WorkflowStatusEnum.ARCHIVED);
      expect(workflow.domainEvents.some(e => e.constructor.name === 'WorkflowCancelled')).toBe(true);
    });

    it('should prevent modifications to archived workflow', () => {
      workflow.archive();
      expect(() => workflow.addTrigger(WorkflowTrigger.create('trig-2', TriggerType.FIRST_ORDER)))
        .toThrow('Cannot modify triggers of an archived workflow');
      expect(() => workflow.addStep(WorkflowStep.createActionStep('step-2', 'B', action)))
        .toThrow('Cannot modify steps of an archived workflow');
    });
  });
});
