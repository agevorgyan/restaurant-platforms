import { Entity, Identifier } from '@saas/domain';

export class AttachmentReferenceId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AttachmentReferenceId { return new AttachmentReferenceId(value); }
  public static generate(): AttachmentReferenceId { return new AttachmentReferenceId(crypto.randomUUID()); }
}

export class AttachmentReference extends Entity<AttachmentReferenceId> {
  constructor(
    id: AttachmentReferenceId,
    public readonly storageKey: string, // e.g. S3 URI
    public readonly fileName: string,
    public readonly mimeType: string,
    public readonly sizeBytes: number
  ) {
    super(id);
  }

  public static create(storageKey: string, fileName: string, mimeType: string, sizeBytes: number): AttachmentReference {
    if (!storageKey || storageKey.trim().length === 0) throw new Error('Storage key cannot be empty.');
    return new AttachmentReference(AttachmentReferenceId.generate(), storageKey, fileName, mimeType, sizeBytes);
  }
}
