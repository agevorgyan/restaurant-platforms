import { Entity, Identifier } from '@saas/domain';

export class ExportRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ExportRecordId { return new ExportRecordId(value); }
  public static generate(): ExportRecordId { return new ExportRecordId(crypto.randomUUID()); }
}

export class ExportRecord extends Entity<ExportRecordId> {
  constructor(
    id: ExportRecordId,
    public readonly format: string,
    public readonly destination: string,
    public readonly exportedAt: Date,
    public readonly exportedBy: string
  ) {
    super(id);
  }

  public static create(format: string, destination: string, exportedBy: string): ExportRecord {
    return new ExportRecord(ExportRecordId.generate(), format, destination, new Date(), exportedBy);
  }
}
