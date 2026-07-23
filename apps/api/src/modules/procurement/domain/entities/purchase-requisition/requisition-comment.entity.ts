import { Entity } from '@saas/core';

export interface RequisitionCommentProps {
  content: string;
  authorId: string;
  createdAt: Date;
}

export class RequisitionComment extends Entity<RequisitionCommentProps> {
  get content(): string { return this.props.content; }
  get authorId(): string { return this.props.authorId; }
  get createdAt(): Date { return this.props.createdAt; }

  private constructor(id: string, props: RequisitionCommentProps) {
    super(id, props);
  }

  public static create(props: Omit<RequisitionCommentProps, 'createdAt'>, id?: string): RequisitionComment {
    if (!props.content || props.content.trim() === '') {
      throw new Error('Comment content is required');
    }
    if (!props.authorId || props.authorId.trim() === '') {
      throw new Error('Author ID is required for comment');
    }
    return new RequisitionComment(id || crypto.randomUUID(), {
      ...props,
      createdAt: new Date()
    });
  }
}
