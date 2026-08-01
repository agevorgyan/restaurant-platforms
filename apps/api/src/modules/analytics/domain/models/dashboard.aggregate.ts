/**
 * Enterprise Dashboard Platform - Domain Aggregate Root
 *
 * DashboardAggregate encapsulates dashboard definitions, layouts, themes, widgets,
 * global filters, lifecycle states (DRAFT -> PUBLISHED -> ARCHIVED), semantic versioning,
 * immutability rules, and domain event dispatching.
 */

import { DashboardStatus, DashboardType } from '../enums/dashboard.enums';
import {
  DashboardId,
  DashboardLayout,
  DashboardTheme,
  DashboardVersion,
  DashboardFilter,
  WidgetDefinition,
  WidgetId,
} from '../value-objects/dashboard-vo';
import {
  ImmutableDashboardModificationException,
  InvalidDashboardLayoutException,
  WidgetNotFoundException,
} from '../exceptions/dashboard.exceptions';

import { BaseAnalyticsDomainEvent } from '../events/analytics.events';
import {
  DashboardCreatedEvent,
  DashboardPublishedEvent,
  WidgetAddedEvent,
  WidgetUpdatedEvent,
  DashboardViewedEvent,
  DashboardRefreshedEvent,
  FilterAppliedEvent,
} from '../events/dashboard.events';

export interface CreateDashboardProps {
  name: string;
  description?: string;
  tenantId: string;
  dashboardType: DashboardType;
  layout?: DashboardLayout;
  theme?: DashboardTheme;
  createdBy?: string;
  tags?: string[];
}

export class DashboardAggregate {
  private readonly id: DashboardId;
  private readonly tenantId: string;
  private name: string;
  private description?: string;
  private dashboardType: DashboardType;
  private status: DashboardStatus;
  private version: DashboardVersion;
  private layout: DashboardLayout;
  private theme: DashboardTheme;
  private widgets: Map<string, WidgetDefinition>;
  private filters: DashboardFilter[];
  private tags: string[];
  private createdBy: string;
  private updatedBy: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private uncommittedEvents: BaseAnalyticsDomainEvent[] = [];

  private constructor(props: {
    id: DashboardId;
    tenantId: string;
    name: string;
    description?: string;
    dashboardType: DashboardType;
    status: DashboardStatus;
    version: DashboardVersion;
    layout: DashboardLayout;
    theme: DashboardTheme;
    widgets?: WidgetDefinition[];
    filters?: DashboardFilter[];
    tags?: string[];
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.tenantId = props.tenantId;
    this.name = props.name;
    this.description = props.description;
    this.dashboardType = props.dashboardType;
    this.status = props.status;
    this.version = props.version;
    this.layout = props.layout;
    this.theme = props.theme;
    this.widgets = new Map();
    if (props.widgets) {
      props.widgets.forEach((w) => this.widgets.set(w.widgetId.getValue(), w));
    }
    this.filters = props.filters || [];
    this.tags = props.tags || [];
    this.createdBy = props.createdBy || 'system';
    this.updatedBy = props.updatedBy || props.createdBy || 'system';
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Factory method to create a new Dashboard aggregate in DRAFT state
   */
  public static create(props: CreateDashboardProps): DashboardAggregate {
    const id = DashboardId.create();
    const version = DashboardVersion.initial();
    const layout = props.layout || DashboardLayout.defaultGrid();
    const theme = props.theme || DashboardTheme.defaultTheme();

    const aggregate = new DashboardAggregate({
      id,
      tenantId: props.tenantId,
      name: props.name,
      description: props.description,
      dashboardType: props.dashboardType,
      status: DashboardStatus.DRAFT,
      version,
      layout,
      theme,
      tags: props.tags,
      createdBy: props.createdBy,
    });

    aggregate.addDomainEvent(
      new DashboardCreatedEvent(
        id.getValue(),
        props.tenantId,
        props.name,
        props.dashboardType,
        version.toString()
      )
    );

    return aggregate;
  }

  /**
   * Reconstitute aggregate from persistent storage
   */
  public static reconstitute(props: {
    id: DashboardId;
    tenantId: string;
    name: string;
    description?: string;
    dashboardType: DashboardType;
    status: DashboardStatus;
    version: DashboardVersion;
    layout: DashboardLayout;
    theme: DashboardTheme;
    widgets: WidgetDefinition[];
    filters: DashboardFilter[];
    tags: string[];
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
  }): DashboardAggregate {
    return new DashboardAggregate(props);
  }

  // Aggregate Getters
  public getId(): DashboardId {
    return this.id;
  }

  public getTenantId(): string {
    return this.tenantId;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getDashboardType(): DashboardType {
    return this.dashboardType;
  }

  public getStatus(): DashboardStatus {
    return this.status;
  }

  public getVersion(): DashboardVersion {
    return this.version;
  }

  public getLayout(): DashboardLayout {
    return this.layout;
  }

  public getTheme(): DashboardTheme {
    return this.theme;
  }

  public getWidgets(): WidgetDefinition[] {
    return Array.from(this.widgets.values());
  }

  public getWidget(widgetId: string): WidgetDefinition | undefined {
    return this.widgets.get(widgetId);
  }

  public getFilters(): DashboardFilter[] {
    return [...this.filters];
  }

  public getTags(): string[] {
    return [...this.tags];
  }

  public getCreatedBy(): string {
    return this.createdBy;
  }

  public getUpdatedBy(): string {
    return this.updatedBy;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Immutability Enforcement
  private assertMutable(): void {
    if (this.status === DashboardStatus.PUBLISHED) {
      throw new ImmutableDashboardModificationException(
        this.id.getValue(),
        this.version.toString()
      );
    }
  }

  /**
   * Publish dashboard. Locks current version.
   */
  public publish(publishedBy: string): void {
    if (this.status === DashboardStatus.PUBLISHED) {
      return;
    }
    this.status = DashboardStatus.PUBLISHED;
    this.updatedBy = publishedBy;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new DashboardPublishedEvent(
        this.id.getValue(),
        this.tenantId,
        this.version.toString(),
        publishedBy
      )
    );
  }

  /**
   * Create a new DRAFT version from a published dashboard
   */
  public createNextDraft(createdBy: string): DashboardAggregate {
    const nextVersion = this.version.incrementMinor();
    const newDraft = new DashboardAggregate({
      id: DashboardId.create(),
      tenantId: this.tenantId,
      name: `${this.name} (Draft v${nextVersion.toString()})`,
      description: this.description,
      dashboardType: this.dashboardType,
      status: DashboardStatus.DRAFT,
      version: nextVersion,
      layout: this.layout,
      theme: this.theme,
      widgets: Array.from(this.widgets.values()),
      filters: [...this.filters],
      tags: [...this.tags],
      createdBy,
    });

    newDraft.addDomainEvent(
      new DashboardCreatedEvent(
        newDraft.getId().getValue(),
        this.tenantId,
        newDraft.getName(),
        this.dashboardType,
        nextVersion.toString()
      )
    );

    return newDraft;
  }

  /**
   * Add a widget to the dashboard
   */
  public addWidget(widget: WidgetDefinition, updatedBy: string = 'system'): void {
    this.assertMutable();

    // Validate layout bounds if grid mode
    if (this.layout.layoutType === 'GRID' || this.layout.layoutType === 'RESPONSIVE') {
      if (widget.position.x + widget.size.width > this.layout.columns) {
        throw new InvalidDashboardLayoutException(
          `Widget '${widget.title}' exceeds grid column limit (${widget.position.x + widget.size.width} > ${this.layout.columns})`
        );
      }
    }

    this.widgets.set(widget.widgetId.getValue(), widget);
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new WidgetAddedEvent(
        this.id.getValue(),
        this.tenantId,
        widget.widgetId.getValue(),
        widget.type,
        widget.title
      )
    );
  }

  /**
   * Update an existing widget
   */
  public updateWidget(widget: WidgetDefinition, updatedBy: string = 'system'): void {
    this.assertMutable();
    const widgetIdStr = widget.widgetId.getValue();
    if (!this.widgets.has(widgetIdStr)) {
      throw new WidgetNotFoundException(widgetIdStr);
    }

    this.widgets.set(widgetIdStr, widget);
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new WidgetUpdatedEvent(
        this.id.getValue(),
        this.tenantId,
        widgetIdStr,
        widget.type
      )
    );
  }

  /**
   * Remove widget from dashboard
   */
  public removeWidget(widgetId: string, updatedBy: string = 'system'): void {
    this.assertMutable();
    if (!this.widgets.has(widgetId)) {
      throw new WidgetNotFoundException(widgetId);
    }
    this.widgets.delete(widgetId);
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  /**
   * Update dashboard layout configuration
   */
  public updateLayout(layout: DashboardLayout, updatedBy: string = 'system'): void {
    this.assertMutable();
    this.layout = layout;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  /**
   * Update dashboard theme
   */
  public updateTheme(theme: DashboardTheme, updatedBy: string = 'system'): void {
    this.assertMutable();
    this.theme = theme;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  /**
   * Add or update filter
   */
  public addFilter(filter: DashboardFilter, updatedBy: string = 'system'): void {
    this.assertMutable();
    this.filters = this.filters.filter((f) => f.filterId !== filter.filterId);
    this.filters.push(filter);
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  /**
   * Record filter application
   */
  public applyFilter(filterId: string, value: unknown): void {
    const filter = this.filters.find((f) => f.filterId === filterId);
    if (filter) {
      this.addDomainEvent(
        new FilterAppliedEvent(
          this.id.getValue(),
          this.tenantId,
          filter.filterId,
          filter.name,
          value,
          filter.targetWidgetIds
        )
      );
    }
  }

  /**
   * Record dashboard view
   */
  public recordView(userId: string, loadLatencyMs: number): void {
    this.addDomainEvent(
      new DashboardViewedEvent(
        this.id.getValue(),
        this.tenantId,
        userId,
        loadLatencyMs
      )
    );
  }

  /**
   * Record dashboard refresh execution
   */
  public recordRefresh(strategy: string, latencyMs: number, widgetCount: number): void {
    this.addDomainEvent(
      new DashboardRefreshedEvent(
        this.id.getValue(),
        this.tenantId,
        strategy,
        latencyMs,
        widgetCount
      )
    );
  }

  /**
   * Archive dashboard
   */
  public archive(updatedBy: string = 'system'): void {
    this.status = DashboardStatus.ARCHIVED;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  // Domain Events Management
  private addDomainEvent(event: BaseAnalyticsDomainEvent): void {
    this.uncommittedEvents.push(event);
  }

  public getUncommittedEvents(): BaseAnalyticsDomainEvent[] {
    return [...this.uncommittedEvents];
  }

  public clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }
}
