import { DomainEvent } from '@saas/core';

export class ProductionCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly productionId: string,
    public readonly recipeId: string,
    public readonly productionType: string
  ) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}

export class ProductionScheduledEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly productionId: string) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}

export class ProductionStartedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly productionId: string) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}

export class ProductionPausedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly productionId: string) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}

export class ProductionCompletedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly productionId: string) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}

export class ProductionCancelledEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly productionId: string,
    public readonly reason: string
  ) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}

export class ProductionIngredientConsumedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly productionId: string,
    public readonly ingredientId: string,
    public readonly quantity: number
  ) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}

export class ProductionOutputRecordedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly productionId: string,
    public readonly productId: string,
    public readonly quantity: number
  ) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}

export class ProductionQualityApprovedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly productionId: string,
    public readonly inspectorId: string
  ) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}

export class ProductionQualityRejectedEvent implements DomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly productionId: string,
    public readonly inspectorId: string,
    public readonly reason: string
  ) {}

  public getAggregateId(): string {
    return this.productionId;
  }
}
