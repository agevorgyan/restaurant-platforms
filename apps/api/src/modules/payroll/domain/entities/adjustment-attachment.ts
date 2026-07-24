import { Entity, Identifier } from '@saas/domain';

export class AdjustmentAttachmentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AdjustmentAttachmentId { return new AdjustmentAttachmentId(value); }
  public static generate(): AdjustmentAttachmentId { return new AdjustmentAttachmentId(crypto.randomUUID()); }
}

export class AdjustmentAttachment extends Entity<AdjustmentAttachmentId> {
  constructor(
    id: AdjustmentAttachmentId,
    public readonly fileUrl: string,
    public readonly fileName: string,
    public readonly uploadedAt: Date
  ) {
    super(id);
  }

  public static create(fileUrl: string, fileName: string): AdjustmentAttachment {
    return new AdjustmentAttachment(AdjustmentAttachmentId.generate(), fileUrl, fileName, new Date());
  }
}
