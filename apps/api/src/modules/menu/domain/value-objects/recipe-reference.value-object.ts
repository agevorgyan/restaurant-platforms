import { ValueObject } from '@saas/core';

export interface RecipeReferenceProps { recipeId: string; }

export class RecipeReference extends ValueObject<RecipeReferenceProps> {
  get recipeId(): string { return this.props.recipeId; }
  private constructor(props: RecipeReferenceProps) { super(props); }
  public static create(recipeId: string): RecipeReference {
    if (!recipeId) throw new Error('RecipeReference cannot be empty');
    return new RecipeReference({ recipeId });
  }
}