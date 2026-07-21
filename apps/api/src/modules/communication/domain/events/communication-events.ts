import { DomainEvent } from '@saas/core';

export class NotificationTemplateCreated implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly templateId: string, public readonly name: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.templateId; }
}

export class NotificationTemplatePublished implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly templateId: string, public readonly versionId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.templateId; }
}

export class NotificationTemplateArchived implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly templateId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.templateId; }
}

export class CommunicationChannelEnabled implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly channelId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.channelId; }
}

export class CommunicationChannelDisabled implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly channelId: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.channelId; }
}

export class NotificationScheduled implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(
    public readonly notificationId: string,
    public readonly templateId: string,
    public readonly recipientId: string
  ) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.notificationId; }
}

export class NotificationCancelled implements DomainEvent {
  public readonly dateTimeOccurred: Date;
  constructor(public readonly notificationId: string, public readonly reason?: string) {
    this.dateTimeOccurred = new Date();
  }
  getAggregateId(): string { return this.notificationId; }
}
