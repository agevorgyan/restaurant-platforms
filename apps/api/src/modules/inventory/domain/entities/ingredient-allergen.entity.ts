import { Entity } from '@saas/core';

export const AllergenSeverityEnum = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
} as const;

export type AllergenSeverityEnum = typeof AllergenSeverityEnum[keyof typeof AllergenSeverityEnum];

export interface IngredientAllergenProps {
  id: string;
  ingredientId: string;
  allergenName: string;
  severity: AllergenSeverityEnum;
  containsTraces: boolean;
}

export class IngredientAllergen extends Entity<IngredientAllergenProps> {
  get id(): string {
    return this._id;
  }

  get allergenName(): string {
    return this.props.allergenName;
  }

  get severity(): AllergenSeverityEnum {
    return this.props.severity;
  }

  get containsTraces(): boolean {
    return this.props.containsTraces;
  }

  public static create(props: IngredientAllergenProps): IngredientAllergen {
    if (!props.allergenName || props.allergenName.trim().length === 0) {
      throw new Error('Allergen name cannot be empty');
    }

    if (!Object.values(AllergenSeverityEnum).includes(props.severity)) {
      throw new Error(`Invalid allergen severity: ${props.severity}`);
    }

    return new IngredientAllergen(props.id, {
      ...props,
      allergenName: props.allergenName.trim()
    });
  }
}
