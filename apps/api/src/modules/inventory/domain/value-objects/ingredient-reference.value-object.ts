import { ValueObject } from '@saas/core';

interface IngredientReferenceProps {
  externalId: string;
  source: string;
}

export class IngredientReference extends ValueObject<IngredientReferenceProps> {
  get externalId(): string {
    return this.props.externalId;
  }

  get source(): string {
    return this.props.source;
  }

  private constructor(props: IngredientReferenceProps) {
    super(props);
  }

  public static create(externalId: string, source: string): IngredientReference {
    if (!externalId || externalId.trim().length === 0) {
      throw new Error('External ID cannot be empty');
    }
    
    if (!source || source.trim().length === 0) {
      throw new Error('Source cannot be empty');
    }

    return new IngredientReference({ 
      externalId: externalId.trim(),
      source: source.trim()
    });
  }
}
