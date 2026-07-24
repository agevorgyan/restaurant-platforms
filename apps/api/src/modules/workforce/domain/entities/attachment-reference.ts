import { Entity, Identifier } from '@saas/domain';

export class AttachmentReferenceId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AttachmentReferenceId { return new AttachmentReferenceId(value); }
  public static generate(): AttachmentReferenceId { return new AttachmentReferenceId(crypto.randomUUID()); }
}

export class AttachmentReference extends Entity<AttachmentReferenceId> {
  constructor(
    id: AttachmentReferenceId,
    public readonly fileUrl: string,
    public readonly fileName: string,
    public readonly uploadedAt: Date
  ) {
    super(id);
  }

  public static create(fileUrl: string, fileName: string): AttachmentReference {
    if (!fileUrl || !fileName) {
      throw new Error('Attachment must have a valid URL and name.');
    }
    return new AttachmentReference(AttachmentReferenceId.generate(), fileUrl, fileName, new Date());
  }
}
