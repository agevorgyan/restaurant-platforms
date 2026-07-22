import { Entity } from '@saas/core';

export interface RecipeInstructionProps {
  id: string;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RecipeInstruction extends Entity<RecipeInstructionProps> {
  get id(): string {
    return this._id;
  }

  get content(): string {
    return this.props.content;
  }

  get mediaUrl(): string | undefined {
    return this.props.mediaUrl;
  }

  private constructor(id: string, props: RecipeInstructionProps) {
    super(id, props);
  }

  public static create(
    id: string,
    content: string,
    mediaUrl?: string
  ): RecipeInstruction {
    if (!content || content.trim() === '') {
      throw new Error('Instruction content cannot be empty');
    }

    return new RecipeInstruction(id, {
      id,
      content: content.trim(),
      mediaUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
