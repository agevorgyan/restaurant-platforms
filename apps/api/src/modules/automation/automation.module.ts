import { Module } from '@nestjs/common';
import { WorkflowController, RulesController } from './infrastructure/controllers';
import {
  WorkflowService,
  WorkflowExecutionService,
  WorkflowDefinitionService,
  WorkflowStateService,
  CompensationService,
  ApprovalService,
  TimerService,
  WorkflowPersistenceService,
  RuleService,
  RuleEvaluationService,
  DecisionService,
  ExpressionEngineService,
  PolicyService,
  RuleVersionService,
  SimulationService,
} from './application/services';

@Module({
  controllers: [
    WorkflowController,
    RulesController,
  ],
  providers: [
    WorkflowService,
    WorkflowExecutionService,
    WorkflowDefinitionService,
    WorkflowStateService,
    CompensationService,
    ApprovalService,
    TimerService,
    WorkflowPersistenceService,
    RuleService,
    RuleEvaluationService,
    DecisionService,
    ExpressionEngineService,
    PolicyService,
    RuleVersionService,
    SimulationService,
  ],
  exports: [
    WorkflowService,
    WorkflowExecutionService,
    RuleService,
    RuleEvaluationService,
  ],
})
export class AutomationModule {}
