import { DomainPrimitive } from '@saas/domain';

export class RoleDescription extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RoleDescription {
    return new RoleDescription(value.trim());
  }
}
