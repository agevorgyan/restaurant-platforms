import { Module } from '@nestjs/common';
import { WorkflowController } from './infrastructure/controllers';
import {
  WorkflowService,
  WorkflowExecutionService,
  WorkflowDefinitionService,
  WorkflowStateService,
  CompensationService,
  ApprovalService,
  TimerService,
  WorkflowPersistenceService,
} from './application/services';

@Module({
  controllers: [WorkflowController],
  providers: [
    WorkflowService,
    WorkflowExecutionService,
    WorkflowDefinitionService,
    WorkflowStateService,
    CompensationService,
    ApprovalService,
    TimerService,
    WorkflowPersistenceService,
  ],
  exports: [
    WorkflowService,
    WorkflowExecutionService,
  ],
})
export class AutomationModule {}
