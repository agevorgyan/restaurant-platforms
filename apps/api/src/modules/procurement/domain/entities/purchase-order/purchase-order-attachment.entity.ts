import { Entity } from '@saas/core';

export interface PurchaseOrderAttachmentProps {
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

export class PurchaseOrderAttachment extends Entity<PurchaseOrderAttachmentProps> {
  get fileName(): string { return this.props.fileName; }
  get fileUrl(): string { return this.props.fileUrl; }
  get uploadedAt(): Date { return this.props.uploadedAt; }

  private constructor(id: string, props: PurchaseOrderAttachmentProps) { super(id, props); }

  public static create(props: PurchaseOrderAttachmentProps, id?: string): PurchaseOrderAttachment {
    return new PurchaseOrderAttachment(id || crypto.randomUUID(), { ...props, uploadedAt: props.uploadedAt || new Date() });
  }
}