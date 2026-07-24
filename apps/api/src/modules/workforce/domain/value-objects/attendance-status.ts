import { DomainPrimitive } from '@saas/domain';

export enum AttendanceStatusEnum {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  ON_LEAVE = 'ON_LEAVE'
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
}
