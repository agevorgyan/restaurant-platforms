import { Entity, Identifier } from '@saas/domain';

export class AdjustmentLineId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AdjustmentLineId { return new AdjustmentLineId(value); }
  public static generate(): AdjustmentLineId { return new AdjustmentLineId(crypto.randomUUID()); }
}

export class AdjustmentLine extends Entity<AdjustmentLineId> {
  constructor(
    id: AdjustmentLineId,
    public readonly description: string,
    public readonly amount: number
  ) {
    super(id);
  }

  public static create(description: string, amount: number): AdjustmentLine {
    return new AdjustmentLine(AdjustmentLineId.generate(), description, amount);
  }
}
