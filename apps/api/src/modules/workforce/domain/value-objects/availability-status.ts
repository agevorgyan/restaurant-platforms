import { DomainPrimitive } from '@saas/domain';

export enum AvailabilityStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export class AvailabilityStatus extends DomainPrimitive<AvailabilityStatusEnum> {
  private constructor(value: AvailabilityStatusEnum) {
    super(value);
  }

  public static create(value: AvailabilityStatusEnum): AvailabilityStatus {
    if (!Object.values(AvailabilityStatusEnum).includes(value)) {
      throw new Error(`Invalid availability status: ${value}`);
    }
    return new AvailabilityStatus(value);
  }
}
