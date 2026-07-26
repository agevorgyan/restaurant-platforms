import { Module } from '@nestjs/common';
import { WorkflowController, RulesController, EventsController, SchedulerController } from './infrastructure/controllers';
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
  EventPublisherService,
  EventSubscriberService,
  EventRouterService,
  EventReplayService,
  DeadLetterService,
  RetryService,
  CorrelationService,
  SubscriptionService,
  SchedulerService,
  JobExecutionService,
  CronService,
  CalendarService,
  MisfireHandlerService,
  DistributedLockService,
  LeaderElectionService,
  SchedulePersistenceService,
} from './application/services';

@Module({
  controllers: [
    WorkflowController,
    RulesController,
    EventsController,
    SchedulerController,
  ],
  providers: [
    // Workflow Engine
    WorkflowService,
    WorkflowExecutionService,
    WorkflowDefinitionService,
    WorkflowStateService,
    CompensationService,
    ApprovalService,
    TimerService,
    WorkflowPersistenceService,
    // Business Rules Engine
    RuleService,
    RuleEvaluationService,
    DecisionService,
    ExpressionEngineService,
    PolicyService,
    RuleVersionService,
    SimulationService,
    // Event Processing Platform
    EventPublisherService,
    EventSubscriberService,
    EventRouterService,
    EventReplayService,
    DeadLetterService,
    RetryService,
    CorrelationService,
    SubscriptionService,
    // Scheduler Platform
    DistributedLockService,
    LeaderElectionService,
    CronService,
    CalendarService,
    MisfireHandlerService,
    SchedulePersistenceService,
    JobExecutionService,
    SchedulerService,
  ],
  exports: [
    // Workflow Engine exports
    WorkflowService,
    WorkflowExecutionService,
    // Rules Engine exports
    RuleService,
    RuleEvaluationService,
    // Event Platform exports
    EventPublisherService,
    SubscriptionService,
    // Scheduler Platform exports
    SchedulerService,
    JobExecutionService,
    CronService,
  ],
})
export class AutomationModule {}

