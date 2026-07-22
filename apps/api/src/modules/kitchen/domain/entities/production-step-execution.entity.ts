import { Entity } from '@saas/core';
import { ProductionStatus } from '../enums/production-status.enum';

export interface ProductionStepExecutionProps {
  id: string;
  stepId: string;
  status: ProductionStatus;
  startedAt?: Date;
  completedAt?: Date;
  executedBy?: string;
  notes?: string;
}

export class ProductionStepExecution extends Entity<ProductionStepExecutionProps> {
  get id(): string {
    return this._id;
  }

  get stepId(): string {
    return this.props.stepId;
  }

  get status(): ProductionStatus {
    return this.props.status;
  }

  get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  get executedBy(): string | undefined {
    return this.props.executedBy;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  private constructor(id: string, props: ProductionStepExecutionProps) {
    super(id, props);
  }

  public static create(id: string, stepId: string): ProductionStepExecution {
    if (!stepId || stepId.trim() === '') {
      throw new Error('Step ID cannot be empty');
    }
    return new ProductionStepExecution(id, {
      id,
      stepId,
      status: ProductionStatus.PLANNED
    });
  }

  public start(executedBy: string): void {
    this.props.status = ProductionStatus.IN_PROGRESS;
    this.props.startedAt = new Date();
    this.props.executedBy = executedBy;
  }

  public complete(notes?: string): void {
    this.props.status = ProductionStatus.COMPLETED;
    this.props.completedAt = new Date();
    if (notes) {
      this.props.notes = notes;
    }
  }
}
