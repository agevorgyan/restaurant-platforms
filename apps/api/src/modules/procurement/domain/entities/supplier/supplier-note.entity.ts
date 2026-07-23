import { Entity } from '@saas/core';

export interface SupplierNoteProps {
  content: string;
  authorId: string;
  createdAt: Date;
}

export class SupplierNote extends Entity<SupplierNoteProps> {
  get content(): string { return this.props.content; }
  get authorId(): string { return this.props.authorId; }
  get createdAt(): Date { return this.props.createdAt; }

  private constructor(props: SupplierNoteProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(props: Omit<SupplierNoteProps, 'createdAt'>, id?: string): SupplierNote {
    if (!props.content || props.content.trim() === '') throw new Error('Note content is required');
    if (!props.authorId || props.authorId.trim() === '') throw new Error('Author ID is required');

    return new SupplierNote({
      ...props,
      createdAt: new Date()
    }, id);
  }
}
