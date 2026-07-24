import { Entity, Identifier } from '@saas/domain';

export class PayrollExportRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollExportRecordId { return new PayrollExportRecordId(value); }
  public static generate(): PayrollExportRecordId { return new PayrollExportRecordId(crypto.randomUUID()); }
}

export class PayrollExportRecord extends Entity<PayrollExportRecordId> {
  constructor(
    id: PayrollExportRecordId,
    public readonly exportFormat: string,
    public readonly destinationSystem: string,
    public readonly exportedAt: Date,
    public readonly exportedBy: string
  ) {
    super(id);
  }

  public static create(
    exportFormat: string,
    destinationSystem: string,
    exportedBy: string
  ): PayrollExportRecord {
    return new PayrollExportRecord(
      PayrollExportRecordId.generate(),
      exportFormat,
      destinationSystem,
      new Date(),
      exportedBy
    );
  }
}
