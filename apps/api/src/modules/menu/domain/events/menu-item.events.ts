import { DomainEvent } from '@saas/core';

export class MenuItemCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class MenuItemPublishedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class MenuItemAvailableEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class MenuItemUnavailableEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class MenuItemArchivedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class ImageAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string, public readonly imageId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class ImageRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string, public readonly imageId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class NutritionUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class AllergensUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class TranslationAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string, public readonly translationId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class TranslationUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string, public readonly translationId: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class ReferenceLinkedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string, public readonly referenceType: string) {}
  getAggregateId(): string { return this.menuItemId; }
}

export class ReferenceUnlinkedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuItemId: string, public readonly referenceType: string) {}
  getAggregateId(): string { return this.menuItemId; }
}