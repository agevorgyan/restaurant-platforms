import { Entity } from '@saas/core';

export interface PurchaseOrderNoteProps {
  text: string;
  authorId: string;
  createdAt: Date;
}

export class PurchaseOrderNote extends Entity<PurchaseOrderNoteProps> {
  get text(): string { return this.props.text; }
  get authorId(): string { return this.props.authorId; }
  get createdAt(): Date { return this.props.createdAt; }

  private constructor(id: string, props: PurchaseOrderNoteProps) { super(id, props); }

  public static create(props: PurchaseOrderNoteProps, id?: string): PurchaseOrderNote {
    return new PurchaseOrderNote(id || crypto.randomUUID(), { ...props, createdAt: props.createdAt || new Date() });
  }
}