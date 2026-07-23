import { Entity } from '@saas/core';

export interface ReceivingDocumentProps {
  documentType: string;
  documentReference: string;
  issuedBy?: string;
  issuedAt: Date;
}

export class ReceivingDocument extends Entity<ReceivingDocumentProps> {
  get documentType(): string { return this.props.documentType; }
  get documentReference(): string { return this.props.documentReference; }
  get issuedBy(): string | undefined { return this.props.issuedBy; }
  get issuedAt(): Date { return this.props.issuedAt; }

  private constructor(id: string, props: ReceivingDocumentProps) { super(id, props); }

  public static create(props: ReceivingDocumentProps, id?: string): ReceivingDocument {
    return new ReceivingDocument(id || crypto.randomUUID(), props);
  }
}