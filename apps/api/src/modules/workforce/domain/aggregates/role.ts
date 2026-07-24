import { AggregateRoot, Identifier } from '@saas/domain';

export class RoleId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RoleId { return new RoleId(value); }
  public static generate(): RoleId { return new RoleId(crypto.randomUUID()); }
}

export class Role extends AggregateRoot<RoleId> {
  constructor(
    id: RoleId,
    public name: string,
    public permissions: string[]
  ) {
    super(id);
  }

  public static create(id: RoleId, name: string, permissions: string[] = []): Role {
    return new Role(id, name, permissions);
  }

  public updatePermissions(permissions: string[]): void {
    this.permissions = permissions;
    this.incrementVersion();
  }
}
