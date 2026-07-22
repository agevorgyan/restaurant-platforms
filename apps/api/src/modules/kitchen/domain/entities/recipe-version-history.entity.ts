import { Entity } from '@saas/core';
import { RecipeVersion } from '../value-objects/recipe-version.value-object';

export interface RecipeVersionHistoryProps {
  id: string;
  version: RecipeVersion;
  changesDescription: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RecipeVersionHistory extends Entity<RecipeVersionHistoryProps> {
  get id(): string {
    return this._id;
  }

  get version(): RecipeVersion {
    return this.props.version;
  }

  get changesDescription(): string {
    return this.props.changesDescription;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  private constructor(id: string, props: RecipeVersionHistoryProps) {
    super(id, props);
  }

  public static create(
    id: string,
    version: RecipeVersion,
    changesDescription: string,
    authorId: string
  ): RecipeVersionHistory {
    if (!changesDescription || changesDescription.trim() === '') {
      throw new Error('Changes description cannot be empty');
    }
    if (!authorId || authorId.trim() === '') {
      throw new Error('Author ID cannot be empty');
    }

    return new RecipeVersionHistory(id, {
      id,
      version,
      changesDescription: changesDescription.trim(),
      authorId: authorId.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
