import { DomainPrimitive } from '@saas/domain';

export enum ShiftStatusEnum {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export class ShiftStatus extends DomainPrimitive<ShiftStatusEnum> {
  private constructor(value: ShiftStatusEnum) {
    super(value);
  }

  public static create(value: ShiftStatusEnum): ShiftStatus {
    if (!Object.values(ShiftStatusEnum).includes(value)) {
      throw new Error(`Invalid shift status: ${value}`);
    }
    return new ShiftStatus(value);
  }

  public canTransitionTo(nextStatus: ShiftStatusEnum): boolean {
    const current = this.value;
    if (current === ShiftStatusEnum.CANCELLED || current === ShiftStatusEnum.COMPLETED) {
      return false; // Terminal states
    }
    if (current === ShiftStatusEnum.SCHEDULED) {
      return nextStatus === ShiftStatusEnum.IN_PROGRESS || nextStatus === ShiftStatusEnum.CANCELLED;
    }
    if (current === ShiftStatusEnum.IN_PROGRESS) {
      return nextStatus === ShiftStatusEnum.COMPLETED;
    }
    return false;
  }
}
