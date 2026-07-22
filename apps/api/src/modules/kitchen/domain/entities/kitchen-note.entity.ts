import { Entity } from '@saas/core';

export interface KitchenNoteProps {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

export class KitchenNote extends Entity<KitchenNoteProps> {
  get id(): string {
    return this._id;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  private constructor(id: string, props: KitchenNoteProps) {
    super(id, props);
  }

  public static create(
    id: string,
    content: string,
    authorId: string
  ): KitchenNote {
    if (!content || content.trim() === '') {
      throw new Error('Note content cannot be empty');
    }
    if (!authorId || authorId.trim() === '') {
      throw new Error('Author ID cannot be empty');
    }

    return new KitchenNote(id, {
      id,
      content: content.trim(),
      authorId: authorId.trim(),
      createdAt: new Date()
    });
  }
}
