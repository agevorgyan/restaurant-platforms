import { ValueObject } from '@saas/core';

export interface RecipeReferenceProps {
  recipeId: string;
  code: string;
  name: string;
}

export class RecipeReference extends ValueObject<RecipeReferenceProps> {
  get recipeId(): string {
    return this.props.recipeId;
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  private constructor(props: RecipeReferenceProps) {
    super(props);
  }

  public static create(recipeId: string, code: string, name: string): RecipeReference {
    if (!recipeId || recipeId.trim().length === 0) {
      throw new Error('Recipe ID cannot be empty');
    }
    if (!code || code.trim().length === 0) {
      throw new Error('Recipe code cannot be empty');
    }
    if (!name || name.trim().length === 0) {
      throw new Error('Recipe name cannot be empty');
    }
    return new RecipeReference({ 
      recipeId: recipeId.trim(), 
      code: code.trim(), 
      name: name.trim() 
    });
  }
}
