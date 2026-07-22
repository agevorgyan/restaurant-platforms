import { Entity } from '@saas/core';

export const StorageRuleTypeEnum = {
  TEMPERATURE: 'TEMPERATURE',
  HUMIDITY: 'HUMIDITY',
  LIGHT: 'LIGHT',
  HANDLING: 'HANDLING'
} as const;

export type StorageRuleTypeEnum = typeof StorageRuleTypeEnum[keyof typeof StorageRuleTypeEnum];

export interface IngredientStorageRuleProps {
  id: string;
  ingredientId: string;
  ruleType: StorageRuleTypeEnum;
  minValue?: number;
  maxValue?: number;
  unit?: string;
  instruction: string;
}

export class IngredientStorageRule extends Entity<IngredientStorageRuleProps> {
  get id(): string {
    return this._id;
  }

  get ruleType(): StorageRuleTypeEnum {
    return this.props.ruleType;
  }

  get minValue(): number | undefined {
    return this.props.minValue;
  }

  get maxValue(): number | undefined {
    return this.props.maxValue;
  }

  get unit(): string | undefined {
    return this.props.unit;
  }

  get instruction(): string {
    return this.props.instruction;
  }

  public static create(props: IngredientStorageRuleProps): IngredientStorageRule {
    if (!Object.values(StorageRuleTypeEnum).includes(props.ruleType)) {
      throw new Error(`Invalid storage rule type: ${props.ruleType}`);
    }

    if (!props.instruction || props.instruction.trim().length === 0) {
      throw new Error('Storage rule instruction cannot be empty');
    }

    if (props.minValue !== undefined && props.maxValue !== undefined) {
      if (props.minValue > props.maxValue) {
        throw new Error('Minimum value cannot be greater than maximum value');
      }
    }

    return new IngredientStorageRule(props.id, {
      ...props,
      instruction: props.instruction.trim()
    });
  }
}
