import { Entity, Identifier } from '@saas/domain';

export class DocumentApprovalRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentApprovalRecordId { return new DocumentApprovalRecordId(value); }
  public static generate(): DocumentApprovalRecordId { return new DocumentApprovalRecordId(crypto.randomUUID()); }
}

export class DocumentApprovalRecord extends Entity<DocumentApprovalRecordId> {
  constructor(
    id: DocumentApprovalRecordId,
    public readonly approverId: string,
    public readonly role: string,
    public readonly timestamp: Date,
    public readonly status: string,
    public readonly comments: string
  ) {
    super(id);
  }

  public static create(approverId: string, role: string, status: string, comments: string = ''): DocumentApprovalRecord {
    return new DocumentApprovalRecord(DocumentApprovalRecordId.generate(), approverId, role, new Date(), status, comments);
  }
}
