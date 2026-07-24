import { Identifier } from '@saas/domain';

export class PayrollRunId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollRunId { return new PayrollRunId(value); }
  public static generate(): PayrollRunId { return new PayrollRunId(crypto.randomUUID()); }
}
