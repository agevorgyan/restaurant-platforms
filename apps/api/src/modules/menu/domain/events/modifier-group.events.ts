import { DomainEvent } from '@saas/core';

export class ModifierGroupCreatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class ModifierGroupPublishedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class ModifierGroupActivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class ModifierGroupDeactivatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class ModifierGroupArchivedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class ModifierOptionAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string, public readonly optionId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class ModifierOptionRemovedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string, public readonly optionId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class SelectionRuleUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class DisplayConfigurationUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class ModifierTranslationAddedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string, public readonly translationId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}

export class ModifierTranslationUpdatedEvent implements DomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(public readonly modifierGroupId: string, public readonly translationId: string) {}
  getAggregateId(): string { return this.modifierGroupId; }
}