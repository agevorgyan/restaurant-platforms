import { Entity, Identifier } from '@saas/domain';

export class CertificationAttachmentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CertificationAttachmentId { return new CertificationAttachmentId(value); }
  public static generate(): CertificationAttachmentId { return new CertificationAttachmentId(crypto.randomUUID()); }
}

export class CertificationAttachment extends Entity<CertificationAttachmentId> {
  constructor(
    id: CertificationAttachmentId,
    public readonly fileUrl: string,
    public readonly mimeType: string,
    public readonly uploadedAt: Date
  ) {
    super(id);
  }

  public static create(fileUrl: string, mimeType: string): CertificationAttachment {
    return new CertificationAttachment(CertificationAttachmentId.generate(), fileUrl, mimeType, new Date());
  }
}
