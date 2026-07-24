import { Identifier } from '@saas/domain';

export class PayrollId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollId { return new PayrollId(value); }
  public static generate(): PayrollId { return new PayrollId(crypto.randomUUID()); }
}
