import { Entity, Identifier } from '@saas/domain';

export class DocumentLineId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentLineId { return new DocumentLineId(value); }
  public static generate(): DocumentLineId { return new DocumentLineId(crypto.randomUUID()); }
}

export class DocumentLine extends Entity<DocumentLineId> {
  constructor(
    id: DocumentLineId,
    public readonly label: string,
    public readonly value: string,
    public readonly dataType: string,
    public readonly order: number
  ) {
    super(id);
  }

  public static create(label: string, value: string, dataType: string, order: number): DocumentLine {
    return new DocumentLine(DocumentLineId.generate(), label, value, dataType, order);
  }
}
