import { DomainPrimitive } from '@saas/domain';

export enum AttendanceSourceEnum {
  TERMINAL = 'TERMINAL',
  MOBILE_APP = 'MOBILE_APP',
  MANUAL_ENTRY = 'MANUAL_ENTRY',
  SYSTEM = 'SYSTEM'
}

export class AttendanceSource extends DomainPrimitive<AttendanceSourceEnum> {
  private constructor(value: AttendanceSourceEnum) {
    super(value);
  }

  public static create(value: AttendanceSourceEnum): AttendanceSource {
    if (!Object.values(AttendanceSourceEnum).includes(value)) {
      throw new Error(`Invalid attendance source: ${value}`);
    }
    return new AttendanceSource(value);
  }
}
