/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateWorkflowDto, UpdateWorkflowDto, StartWorkflowDto, PublishWorkflowDto } from '../dto/workflow.dto';

@Injectable()
export class WorkflowService {
  async getWorkflows(): Promise<any[]> {
    return [];
  }

  async createWorkflow(dto: CreateWorkflowDto): Promise<any> {
    return {};
  }

  async updateWorkflow(id: string, dto: UpdateWorkflowDto): Promise<any> {
    return {};
  }

  async publishWorkflow(id: string, dto: PublishWorkflowDto): Promise<any> {
    return {};
  }

  async getStatistics(): Promise<any> {
    return {};
  }
}

@Injectable()
export class WorkflowExecutionService {
  async startWorkflowInstance(id: string, dto: StartWorkflowDto): Promise<any> {
    return {};
  }

  async cancelWorkflowInstance(id: string): Promise<void> {}

  async getExecutions(): Promise<any[]> {
    return [];
  }
}

@Injectable()
export class WorkflowDefinitionService {
  async getDefinition(id: string): Promise<any> {
    return {};
  }
}

@Injectable()
export class WorkflowStateService {
  async getInstanceState(id: string): Promise<any> {
    return {};
  }
}

@Injectable()
export class CompensationService {
  async compensateWorkflow(id: string): Promise<void> {}
}

@Injectable()
export class ApprovalService {
  async getPendingApprovals(): Promise<any[]> {
    return [];
  }

  async approveStep(instanceId: string, stepId: string, approvedBy: string): Promise<void> {}
}

@Injectable()
export class TimerService {
  async registerTimer(instanceId: string, stepId: string, timeoutSeconds: number): Promise<void> {}
}

@Injectable()
export class WorkflowPersistenceService {
  async saveInstance(instance: any): Promise<void> {}

  async loadInstance(instanceId: string): Promise<any> {
    return {};
  }
}
