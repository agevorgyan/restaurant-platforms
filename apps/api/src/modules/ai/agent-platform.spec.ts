/**
 * Enterprise AI Agent Platform - Comprehensive Test Suite
 *
 * Tests Goal Decomposition, Multi-Step Execution Planning, Human Approval Gates,
 * Working/Session Memory, Execution Checkpoints, and Agent Services.
 */

import {
  AgentId,
  GoalId,
  ExecutionPlan,
  ExecutionStep,
  ReasoningTrace,
} from './domain/value-objects/agent-vo';
import { AgentType, AgentStatus, StepStatus } from './domain/enums/agent.enums';
import { HumanApprovalRequiredException } from './domain/exceptions/agent.exceptions';
import { AgentAggregate } from './domain/models/agent.aggregate';
import { InMemoryAgentRepository } from './infrastructure/repositories/in-memory-agent.repository';
import { NestEventPublisherAdapter } from '../integration/infrastructure/adapters/connector.adapters';
import {
  PlanningService,
  AgentApprovalService,
  EnterpriseAgentPlatformService,
} from './application/services/agent-platform.services';

describe('Enterprise AI Agent Platform', () => {
  describe('Value Objects & Planning Engine', () => {
    it('should decompose inventory goal into sequential execution steps', () => {
      const planningService = new PlanningService();
      const plan = planningService.decomposeGoal('Check low inventory and reorder poultry', AgentType.INVENTORY_AGENT);

      expect(plan.steps.length).toBe(2);
      expect(plan.steps[0].actionName).toBe('check_inventory_levels');
      expect(plan.steps[0].requiresApproval).toBe(false);
      expect(plan.steps[1].actionName).toBe('reorder_low_stock_items');
      expect(plan.steps[1].requiresApproval).toBe(true); // High risk step requires approval
    });
  });

  describe('AgentAggregate Root & Human Approval Gate', () => {
    it('should pause execution and throw HumanApprovalRequiredException when step requires approval', () => {
      const agent = AgentAggregate.create({
        name: 'Inventory Manager Agent',
        agentType: AgentType.INVENTORY_AGENT,
      });

      const plan = ExecutionPlan.create('Reorder stock', [
        ExecutionStep.create('check_stock', {}, false),
        ExecutionStep.create('submit_purchase_order', { amount: 500 }, true), // High Risk
      ]);

      agent.assignGoal('Reorder stock', plan);

      // Execute Step 1 (Safe)
      const res1 = agent.executeNextStep();
      expect(res1.step?.actionName).toBe('check_stock');
      agent.completeStep(res1.step!.stepId, { inStock: 5 });
      expect(agent.getCheckpoints().length).toBe(1);

      // Execute Step 2 (High Risk -> Throws HumanApprovalRequiredException)
      expect(() => agent.executeNextStep()).toThrow(HumanApprovalRequiredException);
      expect(agent.getStatus()).toBe(AgentStatus.WAITING_APPROVAL);
      expect(agent.getPendingApproval()).toBeDefined();

      // Grant Approval
      agent.grantApproval('store-manager-alice');
      expect(agent.getStatus()).toBe(AgentStatus.READY);

      // Re-run Step 2 (Approved -> Succeeds)
      const res2 = agent.executeNextStep();
      expect(res2.step?.actionName).toBe('submit_purchase_order');
      agent.completeStep(res2.step!.stepId, { poId: 'PO-9912' });

      // Final completion
      agent.executeNextStep();
      expect(agent.getStatus()).toBe(AgentStatus.COMPLETED);
    });

    it('should support pausing and resuming agent execution from checkpoints', () => {
      const agent = AgentAggregate.create({
        name: 'Finance Assistant',
        agentType: AgentType.FINANCE_AGENT,
      });

      agent.pause();
      expect(agent.getStatus()).toBe(AgentStatus.PAUSED);

      agent.resume();
      expect(agent.getStatus()).toBe(AgentStatus.READY);
    });
  });

  describe('Agent Platform Services & End-to-End Orchestration', () => {
    let repo: InMemoryAgentRepository;
    let publisherAdapter: NestEventPublisherAdapter;
    let planningService: PlanningService;
    let approvalService: AgentApprovalService;
    let agentPlatformService: EnterpriseAgentPlatformService;

    beforeEach(() => {
      repo = new InMemoryAgentRepository();
      publisherAdapter = new NestEventPublisherAdapter();
      planningService = new PlanningService();
      approvalService = new AgentApprovalService();

      agentPlatformService = new EnterpriseAgentPlatformService(
        repo,
        publisherAdapter,
        planningService,
        approvalService
      );
    });

    it('should create agent, execute safe goal, and retrieve catalog and metrics', async () => {
      // 1. Create Agent
      const agent = await agentPlatformService.createAgent('tenant-agent-1', {
        name: 'Restaurant Assistant Agent',
        agentType: AgentType.RESTAURANT_ASSISTANT,
      });

      expect(agent.status).toBe(AgentStatus.READY);

      // 2. Execute Safe Goal (No High Risk steps)
      const response = await agentPlatformService.executeGoal('tenant-agent-1', {
        agentId: agent.id,
        goalDescription: 'Retrieve kitchen opening standard operating procedure',
      });

      expect(response.status).toBe(AgentStatus.COMPLETED);
      expect(response.checkpointsCount).toBeGreaterThan(0);

      // 3. Query Catalog & Metrics
      const catalog = await agentPlatformService.getAgentCatalog('tenant-agent-1');
      expect(catalog.totalCount).toBe(1);

      const history = await agentPlatformService.getExecutionHistory();
      expect(history.totalExecutions).toBe(1);

      const stats = await agentPlatformService.getAgentStatistics();
      expect(stats.totalAgents).toBe(1);
    });

    it('should handle high-risk goal execution with approval queue workflow', async () => {
      const agent = await agentPlatformService.createAgent('tenant-agent-1', {
        name: 'Finance Audit Agent',
        agentType: AgentType.FINANCE_AGENT,
      });

      // Execute goal containing high risk refund step
      const pausedResponse = await agentPlatformService.executeGoal('tenant-agent-1', {
        agentId: agent.id,
        goalDescription: 'Process customer refund request',
      });

      expect(pausedResponse.status).toBe(AgentStatus.WAITING_APPROVAL);
      expect(pausedResponse.pendingApproval).toBeDefined();

      // Check Approval Queue
      const queue = await agentPlatformService.getApprovalQueue();
      expect(queue.pendingApprovalsCount).toBe(1);

      // Grant Approval and Resume
      const completedResponse = await agentPlatformService.approveAndResume(agent.id, 'finance-vp-bob');
      expect(completedResponse.status).toBe(AgentStatus.COMPLETED);
    });
  });
});
