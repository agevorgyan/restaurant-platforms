import { DomainPrimitive } from '@saas/domain';

export class RoleCode extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): RoleCode {
    if (!value || value.trim().length === 0) {
      throw new Error('Role code cannot be empty.');
    }
    if (!/^[A-Z0-9_]+$/.test(value)) {
      throw new Error('Role code must contain only uppercase letters, numbers, and underscores.');
    }
    return new RoleCode(value);
  }
}
