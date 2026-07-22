import { ValueObject } from '@saas/core';
import { KitchenTicketStatus as KitchenTicketStatusEnum } from '../enums/kitchen-ticket-status.enum';

export interface KitchenTicketStatusProps {
  value: KitchenTicketStatusEnum;
}

export class KitchenTicketStatus extends ValueObject<KitchenTicketStatusProps> {
  get value(): KitchenTicketStatusEnum {
    return this.props.value;
  }

  private constructor(props: KitchenTicketStatusProps) {
    super(props);
  }

  public static create(value: KitchenTicketStatusEnum): KitchenTicketStatus {
    return new KitchenTicketStatus({ value });
  }

  public isPending(): boolean {
    return this.props.value === KitchenTicketStatusEnum.PENDING;
  }

  public isQueued(): boolean {
    return this.props.value === KitchenTicketStatusEnum.QUEUED;
  }

  public isInPreparation(): boolean {
    return this.props.value === KitchenTicketStatusEnum.IN_PREPARATION;
  }

  public isReady(): boolean {
    return this.props.value === KitchenTicketStatusEnum.READY;
  }

  public isServed(): boolean {
    return this.props.value === KitchenTicketStatusEnum.SERVED;
  }

  public isCancelled(): boolean {
    return this.props.value === KitchenTicketStatusEnum.CANCELLED;
  }

  public canTransitionTo(newStatus: KitchenTicketStatusEnum): boolean {
    if (this.props.value === KitchenTicketStatusEnum.CANCELLED || this.props.value === KitchenTicketStatusEnum.SERVED) {
      return false; // Terminal states
    }
    
    switch (this.props.value) {
      case KitchenTicketStatusEnum.PENDING:
        return [KitchenTicketStatusEnum.QUEUED, KitchenTicketStatusEnum.CANCELLED].includes(newStatus);
      case KitchenTicketStatusEnum.QUEUED:
        return [KitchenTicketStatusEnum.IN_PREPARATION, KitchenTicketStatusEnum.CANCELLED].includes(newStatus);
      case KitchenTicketStatusEnum.IN_PREPARATION:
        return [KitchenTicketStatusEnum.READY, KitchenTicketStatusEnum.CANCELLED].includes(newStatus);
      case KitchenTicketStatusEnum.READY:
        return [KitchenTicketStatusEnum.SERVED].includes(newStatus);
      default:
        return false;
    }
  }
}
