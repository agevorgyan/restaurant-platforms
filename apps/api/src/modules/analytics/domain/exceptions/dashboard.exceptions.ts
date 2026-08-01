/**
 * Enterprise Dashboard Platform - Domain Exceptions
 *
 * Strongly-typed domain exceptions thrown by aggregates, value objects, and domain services
 * when invariant violations occur.
 */

export class InvalidDashboardLayoutException extends Error {
  constructor(message: string) {
    super(`[InvalidDashboardLayoutException] ${message}`);
    this.name = 'InvalidDashboardLayoutException';
  }
}

export class InvalidWidgetDefinitionException extends Error {
  constructor(message: string) {
    super(`[InvalidWidgetDefinitionException] ${message}`);
    this.name = 'InvalidWidgetDefinitionException';
  }
}

export class ImmutableDashboardModificationException extends Error {
  constructor(dashboardId: string, version: string) {
    super(`[ImmutableDashboardModificationException] Dashboard ${dashboardId} (v${version}) is published and immutable. Create a new draft version to modify.`);
    this.name = 'ImmutableDashboardModificationException';
  }
}

export class UnauthorizedDashboardAccessException extends Error {
  constructor(tenantId: string, dashboardId: string) {
    super(`[UnauthorizedDashboardAccessException] Tenant '${tenantId}' does not have access to dashboard '${dashboardId}'.`);
    this.name = 'UnauthorizedDashboardAccessException';
  }
}

export class DashboardNotFoundException extends Error {
  constructor(id: string) {
    super(`[DashboardNotFoundException] Dashboard with ID '${id}' was not found.`);
    this.name = 'DashboardNotFoundException';
  }
}

export class WidgetNotFoundException extends Error {
  constructor(widgetId: string) {
    super(`[WidgetNotFoundException] Widget with ID '${widgetId}' was not found.`);
    this.name = 'WidgetNotFoundException';
  }
}

export class InvalidRefreshPolicyException extends Error {
  constructor(message: string) {
    super(`[InvalidRefreshPolicyException] ${message}`);
    this.name = 'InvalidRefreshPolicyException';
  }
}
