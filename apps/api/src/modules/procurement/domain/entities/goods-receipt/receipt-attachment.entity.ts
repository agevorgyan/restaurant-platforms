import { Entity } from '@saas/core';

export interface ReceiptAttachmentProps {
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

export class ReceiptAttachment extends Entity<ReceiptAttachmentProps> {
  get fileName(): string { return this.props.fileName; }
  get fileUrl(): string { return this.props.fileUrl; }
  get uploadedAt(): Date { return this.props.uploadedAt; }

  private constructor(id: string, props: ReceiptAttachmentProps) { super(id, props); }

  public static create(props: ReceiptAttachmentProps, id?: string): ReceiptAttachment {
    return new ReceiptAttachment(id || crypto.randomUUID(), { ...props, uploadedAt: props.uploadedAt || new Date() });
  }
}