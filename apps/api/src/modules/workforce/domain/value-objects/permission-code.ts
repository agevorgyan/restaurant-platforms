import { DomainPrimitive } from '@saas/domain';

export class PermissionCode extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): PermissionCode {
    if (!value || value.trim().length === 0) {
      throw new Error('Permission code cannot be empty.');
    }
    if (!/^[a-z0-9_:]+$/.test(value)) {
      throw new Error('Permission code must be lowercase, numbers, underscores, or colons (e.g. shift:read).');
    }
    return new PermissionCode(value);
  }
}
