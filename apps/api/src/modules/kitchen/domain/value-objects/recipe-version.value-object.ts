import { ValueObject } from '@saas/core';

export interface RecipeVersionProps {
  version: number;
}

export class RecipeVersion extends ValueObject<RecipeVersionProps> {
  get version(): number {
    return this.props.version;
  }

  private constructor(props: RecipeVersionProps) {
    super(props);
  }

  public static create(version: number = 1): RecipeVersion {
    if (version < 1) {
      throw new Error('Recipe version must be at least 1');
    }
    return new RecipeVersion({ version });
  }

  public increment(): RecipeVersion {
    return new RecipeVersion({ version: this.props.version + 1 });
  }
}
