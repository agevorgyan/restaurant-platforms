import { ValueObject } from '@saas/core';

export enum RecipeStatusEnum {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface RecipeStatusProps {
  value: RecipeStatusEnum;
}

export class RecipeStatus extends ValueObject<RecipeStatusProps> {
  get value(): RecipeStatusEnum {
    return this.props.value;
  }

  private constructor(props: RecipeStatusProps) {
    super(props);
  }

  public static create(value: RecipeStatusEnum): RecipeStatus {
    return new RecipeStatus({ value });
  }

  public isDraft(): boolean {
    return this.props.value === RecipeStatusEnum.DRAFT;
  }

  public isActive(): boolean {
    return this.props.value === RecipeStatusEnum.ACTIVE;
  }

  public isArchived(): boolean {
    return this.props.value === RecipeStatusEnum.ARCHIVED;
  }

  public canTransitionTo(newStatus: RecipeStatusEnum): boolean {
    if (this.props.value === RecipeStatusEnum.ARCHIVED) {
      return false; // Once archived, cannot change
    }
    if (this.props.value === RecipeStatusEnum.DRAFT) {
      return newStatus === RecipeStatusEnum.ACTIVE || newStatus === RecipeStatusEnum.ARCHIVED;
    }
    if (this.props.value === RecipeStatusEnum.ACTIVE) {
      return newStatus === RecipeStatusEnum.DRAFT || newStatus === RecipeStatusEnum.ARCHIVED;
    }
    return false;
  }
}
