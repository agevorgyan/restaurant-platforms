import { Entity, Identifier } from '@saas/domain';

export class DocumentAttachmentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentAttachmentId { return new DocumentAttachmentId(value); }
  public static generate(): DocumentAttachmentId { return new DocumentAttachmentId(crypto.randomUUID()); }
}

export class DocumentAttachment extends Entity<DocumentAttachmentId> {
  constructor(
    id: DocumentAttachmentId,
    public readonly fileName: string,
    public readonly fileType: string,
    public readonly fileUrl: string,
    public readonly fileSize: number
  ) {
    super(id);
  }

  public static create(fileName: string, fileType: string, fileUrl: string, fileSize: number): DocumentAttachment {
    if (fileSize <= 0) throw new Error('File size must be greater than zero.');
    return new DocumentAttachment(DocumentAttachmentId.generate(), fileName, fileType, fileUrl, fileSize);
  }
}
