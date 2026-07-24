import { DomainPrimitive } from '@saas/domain';

export enum AvailabilityTypeEnum {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  SICK_LEAVE = 'SICK_LEAVE',
  VACATION = 'VACATION',
  UNPAID_LEAVE = 'UNPAID_LEAVE'
}

export class AvailabilityType extends DomainPrimitive<AvailabilityTypeEnum> {
  private constructor(value: AvailabilityTypeEnum) {
    super(value);
  }

  public static create(value: AvailabilityTypeEnum): AvailabilityType {
    if (!Object.values(AvailabilityTypeEnum).includes(value)) {
      throw new Error(`Invalid availability type: ${value}`);
    }
    return new AvailabilityType(value);
  }
}
