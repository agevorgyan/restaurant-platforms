import { DomainEvent } from '@saas/core';

export class RecipeCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly recipeId: string,
    public readonly recipeCode: string,
    public readonly restaurantId: string
  ) {}

  public getAggregateId(): string {
    return this.recipeId;
  }
}

export class RecipeUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly recipeId: string,
    public readonly newVersion: number
  ) {}

  public getAggregateId(): string {
    return this.recipeId;
  }
}

export class RecipeActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly recipeId: string) {}

  public getAggregateId(): string {
    return this.recipeId;
  }
}

export class RecipeArchivedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly recipeId: string) {}

  public getAggregateId(): string {
    return this.recipeId;
  }
}

export class RecipeIngredientAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly recipeId: string,
    public readonly ingredientId: string,
    public readonly externalIngredientId: string
  ) {}

  public getAggregateId(): string {
    return this.recipeId;
  }
}

export class RecipeIngredientRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly recipeId: string,
    public readonly ingredientId: string
  ) {}

  public getAggregateId(): string {
    return this.recipeId;
  }
}

export class RecipeStepAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly recipeId: string,
    public readonly stepId: string,
    public readonly stepNumber: number
  ) {}

  public getAggregateId(): string {
    return this.recipeId;
  }
}

export class RecipeStepUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly recipeId: string,
    public readonly stepId: string,
    public readonly stepNumber: number
  ) {}

  public getAggregateId(): string {
    return this.recipeId;
  }
}
