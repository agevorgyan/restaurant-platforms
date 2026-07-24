import { DomainPrimitive } from '@saas/domain';

export enum ScheduleStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  LOCKED = 'LOCKED',
  ARCHIVED = 'ARCHIVED'
}

export class ScheduleStatus extends DomainPrimitive<ScheduleStatusEnum> {
  private constructor(value: ScheduleStatusEnum) {
    super(value);
  }

  public static create(value: ScheduleStatusEnum): ScheduleStatus {
    if (!Object.values(ScheduleStatusEnum).includes(value)) {
      throw new Error(`Invalid schedule status: ${value}`);
    }
    return new ScheduleStatus(value);
  }

  public canTransitionTo(nextStatus: ScheduleStatusEnum): boolean {
    const current = this.value;
    if (current === ScheduleStatusEnum.ARCHIVED) {
      return false; // Terminal state
    }
    if (current === ScheduleStatusEnum.DRAFT) {
      return nextStatus === ScheduleStatusEnum.PUBLISHED || nextStatus === ScheduleStatusEnum.ARCHIVED;
    }
    if (current === ScheduleStatusEnum.PUBLISHED) {
      return nextStatus === ScheduleStatusEnum.LOCKED || nextStatus === ScheduleStatusEnum.ARCHIVED;
    }
    if (current === ScheduleStatusEnum.LOCKED) {
      return nextStatus === ScheduleStatusEnum.PUBLISHED || nextStatus === ScheduleStatusEnum.ARCHIVED; // Unlock back to published
    }
    return false;
  }
}
