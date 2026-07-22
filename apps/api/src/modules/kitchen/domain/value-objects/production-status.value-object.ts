import { ValueObject } from '@saas/core';
import { ProductionStatus as ProductionStatusEnum } from '../enums/production-status.enum';

export interface ProductionStatusProps {
  value: ProductionStatusEnum;
}

export class ProductionStatus extends ValueObject<ProductionStatusProps> {
  get value(): ProductionStatusEnum {
    return this.props.value;
  }

  private constructor(props: ProductionStatusProps) {
    super(props);
  }

  public static create(value: ProductionStatusEnum): ProductionStatus {
    return new ProductionStatus({ value });
  }

  public isPlanned(): boolean {
    return this.props.value === ProductionStatusEnum.PLANNED;
  }

  public isScheduled(): boolean {
    return this.props.value === ProductionStatusEnum.SCHEDULED;
  }

  public isInProgress(): boolean {
    return this.props.value === ProductionStatusEnum.IN_PROGRESS;
  }

  public isPaused(): boolean {
    return this.props.value === ProductionStatusEnum.PAUSED;
  }

  public isCompleted(): boolean {
    return this.props.value === ProductionStatusEnum.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.props.value === ProductionStatusEnum.CANCELLED;
  }

  public canTransitionTo(newStatus: ProductionStatusEnum): boolean {
    if (this.props.value === ProductionStatusEnum.COMPLETED || this.props.value === ProductionStatusEnum.CANCELLED) {
      return false; // Terminal states
    }
    
    switch (this.props.value) {
      case ProductionStatusEnum.PLANNED:
        return [ProductionStatusEnum.SCHEDULED, ProductionStatusEnum.CANCELLED].includes(newStatus);
      case ProductionStatusEnum.SCHEDULED:
        return [ProductionStatusEnum.IN_PROGRESS, ProductionStatusEnum.CANCELLED].includes(newStatus);
      case ProductionStatusEnum.IN_PROGRESS:
        return [ProductionStatusEnum.PAUSED, ProductionStatusEnum.COMPLETED, ProductionStatusEnum.CANCELLED].includes(newStatus);
      case ProductionStatusEnum.PAUSED:
        return [ProductionStatusEnum.IN_PROGRESS, ProductionStatusEnum.CANCELLED].includes(newStatus);
      default:
        return false;
    }
  }
}
