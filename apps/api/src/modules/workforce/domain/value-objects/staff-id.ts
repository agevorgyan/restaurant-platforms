import { Identifier } from '@saas/domain';

export class StaffId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): StaffId {
    return new StaffId(value);
  }

  public static generate(): StaffId {
    return new StaffId(crypto.randomUUID());
  }
}
