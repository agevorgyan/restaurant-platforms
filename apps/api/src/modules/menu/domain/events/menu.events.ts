import { DomainEvent } from '@saas/core';

export class MenuCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuPublishedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuArchivedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class CategoryAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly categoryId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class CategoryRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly categoryId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class SectionAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly categoryId: string, public readonly sectionId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class SectionRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly categoryId: string, public readonly sectionId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuItemLinkedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly sectionId: string, public readonly itemId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class MenuItemUnlinkedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string, public readonly sectionId: string, public readonly itemId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class VisibilityChangedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}

export class LayoutUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}
export class MenuUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly menuId: string) {}
  getAggregateId(): string { return this.menuId; }
}
