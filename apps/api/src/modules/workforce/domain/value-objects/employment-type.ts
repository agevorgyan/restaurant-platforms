import { DomainPrimitive } from '@saas/domain';

export enum EmploymentTypeEnum {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  SEASONAL = 'SEASONAL'
}

export class EmploymentType extends DomainPrimitive<EmploymentTypeEnum> {
  private constructor(value: EmploymentTypeEnum) {
    super(value);
  }

  public static create(value: EmploymentTypeEnum): EmploymentType {
    if (!Object.values(EmploymentTypeEnum).includes(value)) {
      throw new Error(`Invalid employment type: ${value}`);
    }
    return new EmploymentType(value);
  }
}
