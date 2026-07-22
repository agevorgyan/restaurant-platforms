import { DomainEvent } from '@saas/core';

export class IngredientCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string,
    public readonly ingredientCode: string,
    public readonly sku: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class IngredientUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string,
    public readonly version: number
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class IngredientActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class IngredientArchivedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

export class IngredientDiscontinuedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly restaurantId: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }
}
