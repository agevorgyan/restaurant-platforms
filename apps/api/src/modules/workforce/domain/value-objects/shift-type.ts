import { DomainPrimitive } from '@saas/domain';

export enum ShiftTypeEnum {
  OPEN = 'OPEN',
  FIXED = 'FIXED',
  ON_CALL = 'ON_CALL'
}

export class ShiftType extends DomainPrimitive<ShiftTypeEnum> {
  private constructor(value: ShiftTypeEnum) {
    super(value);
  }

  public static create(value: ShiftTypeEnum): ShiftType {
    if (!Object.values(ShiftTypeEnum).includes(value)) {
      throw new Error(`Invalid shift type: ${value}`);
    }
    return new ShiftType(value);
  }
}
