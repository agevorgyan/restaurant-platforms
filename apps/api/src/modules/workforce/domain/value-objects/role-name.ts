import { DomainPrimitive } from '@saas/domain';

export class RoleName extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RoleName {
    if (!value || value.trim().length === 0) {
      throw new Error('Role name cannot be empty.');
    }
    return new RoleName(value.trim());
  }
}
