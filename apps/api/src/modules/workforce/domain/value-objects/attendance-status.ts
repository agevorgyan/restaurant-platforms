import { DomainPrimitive } from '@saas/domain';

export enum AttendanceStatusEnum {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CORRECTION_PENDING = 'CORRECTION_PENDING',
  LOCKED = 'LOCKED'
}

export class AttendanceStatus extends DomainPrimitive<AttendanceStatusEnum> {
  private constructor(value: AttendanceStatusEnum) {
    super(value);
  }

  public static create(value: AttendanceStatusEnum): AttendanceStatus {
    if (!Object.values(AttendanceStatusEnum).includes(value)) {
      throw new Error(`Invalid attendance status: ${value}`);
    }
    return new AttendanceStatus(value);
  }

  public canTransitionTo(nextStatus: AttendanceStatusEnum): boolean {
    const current = this.value;
    if (current === AttendanceStatusEnum.LOCKED) {
      return false; // Terminal state
    }
    if (current === AttendanceStatusEnum.ACTIVE) {
      return nextStatus === AttendanceStatusEnum.COMPLETED || nextStatus === AttendanceStatusEnum.LOCKED;
    }
    if (current === AttendanceStatusEnum.COMPLETED) {
      return nextStatus === AttendanceStatusEnum.CORRECTION_PENDING || nextStatus === AttendanceStatusEnum.LOCKED;
    }
    if (current === AttendanceStatusEnum.CORRECTION_PENDING) {
      return nextStatus === AttendanceStatusEnum.COMPLETED || nextStatus === AttendanceStatusEnum.LOCKED;
    }
    return false;
  }
}
