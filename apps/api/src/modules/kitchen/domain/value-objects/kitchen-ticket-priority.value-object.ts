import { ValueObject } from '@saas/core';
import { ProductionPriority } from '../enums/production-priority.enum';

export interface KitchenTicketPriorityProps {
  value: ProductionPriority;
}

export class KitchenTicketPriority extends ValueObject<KitchenTicketPriorityProps> {
  get value(): ProductionPriority {
    return this.props.value;
  }

  private constructor(props: KitchenTicketPriorityProps) {
    super(props);
  }

  public static create(value: ProductionPriority): KitchenTicketPriority {
    return new KitchenTicketPriority({ value });
  }

  public isRush(): boolean {
    return this.props.value === ProductionPriority.RUSH;
  }

  public isHigh(): boolean {
    return this.props.value === ProductionPriority.HIGH;
  }
}
