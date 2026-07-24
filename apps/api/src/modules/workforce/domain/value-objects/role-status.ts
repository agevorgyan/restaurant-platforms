import { DomainPrimitive } from '@saas/domain';

export enum RoleStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export class RoleStatus extends DomainPrimitive<RoleStatusEnum> {
  private constructor(value: RoleStatusEnum) {
    super(value);
  }

  public static create(value: RoleStatusEnum): RoleStatus {
    if (!Object.values(RoleStatusEnum).includes(value)) {
      throw new Error(`Invalid role status: ${value}`);
    }
    return new RoleStatus(value);
  }
}
