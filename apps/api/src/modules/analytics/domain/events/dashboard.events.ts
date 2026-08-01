/**
 * Enterprise Dashboard Platform - Domain Events
 *
 * Emitted by Dashboard aggregates and services upon lifecycle state transitions,
 * widget mutations, layout updates, views, refreshes, and filter applications.
 */

import { randomUUID } from 'crypto';
import { BaseAnalyticsDomainEvent } from './analytics.events';
import { DashboardType } from '../enums/dashboard.enums';

export class DashboardCreatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'DashboardCreated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly dashboardType: DashboardType,
    public readonly version: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class DashboardPublishedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'DashboardPublished';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly version: string,
    public readonly publishedBy: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class WidgetAddedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'WidgetAdded';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly widgetId: string,
    public readonly widgetType: string,
    public readonly widgetTitle: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class WidgetUpdatedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'WidgetUpdated';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly widgetId: string,
    public readonly widgetType: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class DashboardViewedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'DashboardViewed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly loadLatencyMs: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class DashboardRefreshedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'DashboardRefreshed';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly refreshStrategy: string,
    public readonly latencyMs: number,
    public readonly widgetCountRefreshed: number,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class FilterAppliedEvent implements BaseAnalyticsDomainEvent {
  public readonly eventId: string = randomUUID();
  public readonly eventName: string = 'FilterApplied';

  constructor(
    public readonly aggregateId: string,
    public readonly tenantId: string,
    public readonly filterId: string,
    public readonly filterName: string,
    public readonly filterValue: unknown,
    public readonly affectedWidgetIds: string[],
    public readonly timestamp: Date = new Date()
  ) {}
}

export type DashboardDomainEvent =
  | DashboardCreatedEvent
  | DashboardPublishedEvent
  | WidgetAddedEvent
  | WidgetUpdatedEvent
  | DashboardViewedEvent
  | DashboardRefreshedEvent
  | FilterAppliedEvent;
