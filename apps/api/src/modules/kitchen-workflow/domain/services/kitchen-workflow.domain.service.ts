import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IKitchenWorkflowRepository } from '../repositories/kitchen-workflow.repository.interface';
import { KitchenWorkflowStateMachine } from './kitchen-workflow-state-machine.service';
import { CreateKitchenWorkflowDto } from '../../application/dto/kitchen-workflow.dto';
import { validateCreateKitchenWorkflow } from '../../application/validation/kitchen-workflow.schema';
import { IKitchenWorkflow } from '../entities/kitchen-workflow.interface';
import { KitchenWorkflowState } from '../value-objects/kitchen-workflow-state.value-object';
import { PreparationTimePolicy } from '../value-objects/preparation-time-policy.value-object';
import {
  KitchenPreparationStartedEvent,
  KitchenPreparationPausedEvent,
  KitchenPreparationResumedEvent,
  KitchenPreparationCompletedEvent
} from '../events/kitchen-workflow.events';

@Injectable()
export class KitchenWorkflowDomainService {
  constructor(
    private readonly repository: IKitchenWorkflowRepository,
    private readonly stateMachine: KitchenWorkflowStateMachine
  ) {}

  public async createWorkflow(id: string, dto: CreateKitchenWorkflowDto): Promise<IKitchenWorkflow> {
    const errors = validateCreateKitchenWorkflow(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const workflow: IKitchenWorkflow = {
      id,
      ticketId: dto.ticketId,
      kitchenId: dto.kitchenId,
      state: new KitchenWorkflowState('Pending'),
      timePolicy: new PreparationTimePolicy(dto.expectedDurationMinutes, dto.slaThresholdMinutes),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(workflow);
    return workflow;
  }

  public async queueWorkflow(id: string): Promise<IKitchenWorkflow> {
    const workflow = await this.getWorkflow(id);
    this.stateMachine.transition(workflow, 'Queued');
    await this.repository.save(workflow);
    return workflow;
  }

  public async startPreparation(id: string): Promise<IKitchenWorkflow> {
    const workflow = await this.getWorkflow(id);
    const isResuming = workflow.state.value === 'Paused';

    this.stateMachine.transition(workflow, 'Preparing');
    
    if (!isResuming && !workflow.startedAt) {
      workflow.startedAt = new Date();
      new KitchenPreparationStartedEvent(workflow.id, workflow.kitchenId);
    } else if (isResuming) {
      new KitchenPreparationResumedEvent(workflow.id, workflow.kitchenId);
    }

    await this.repository.save(workflow);
    return workflow;
  }

  public async pausePreparation(id: string): Promise<IKitchenWorkflow> {
    const workflow = await this.getWorkflow(id);
    this.stateMachine.transition(workflow, 'Paused');
    new KitchenPreparationPausedEvent(workflow.id, workflow.kitchenId);
    await this.repository.save(workflow);
    return workflow;
  }

  public async markReady(id: string): Promise<IKitchenWorkflow> {
    const workflow = await this.getWorkflow(id);
    this.stateMachine.transition(workflow, 'Ready');
    await this.repository.save(workflow);
    return workflow;
  }

  public async completeWorkflow(id: string): Promise<IKitchenWorkflow> {
    const workflow = await this.getWorkflow(id);
    this.stateMachine.transition(workflow, 'Completed');
    workflow.completedAt = new Date();
    new KitchenPreparationCompletedEvent(workflow.id, workflow.kitchenId);
    await this.repository.save(workflow);
    return workflow;
  }

  public async cancelWorkflow(id: string): Promise<IKitchenWorkflow> {
    const workflow = await this.getWorkflow(id);
    this.stateMachine.transition(workflow, 'Cancelled');
    await this.repository.save(workflow);
    return workflow;
  }

  public async checkSLA(id: string): Promise<void> {
    const workflow = await this.getWorkflow(id);
    if (workflow.state.isTerminal() || !workflow.startedAt) return;

    const elapsedMinutes = (new Date().getTime() - workflow.startedAt.getTime()) / 60000;
    if (workflow.timePolicy.isExceeded(elapsedMinutes)) {
      // Delay exceeded
    }
  }

  private async getWorkflow(id: string): Promise<IKitchenWorkflow> {
    const workflow = await this.repository.findById(id);
    if (!workflow) throw new NotFoundException('Workflow not found');
    return workflow;
  }
}
