/**
 * Enterprise Frontend Architecture Platform - Value Objects
 *
 * Immutable Value Objects encapsulating route definitions, feature module metadata,
 * typed API requests/responses, TanStack Query keys, cache policies, navigation state, and page metadata.
 */

import { ModuleStatus, RouteType } from '../enums/frontend.enums';

/**
 * RouteDefinition Value Object
 */
export class RouteDefinition {
  public readonly path: string;
  public readonly routeType: RouteType;
  public readonly requiredPermissions: string[];
  public readonly isDynamic: boolean;

  private constructor(path: string, routeType: RouteType, requiredPermissions: string[] = []) {
    if (!path || !path.startsWith('/')) {
      throw new Error('Route path must begin with /');
    }
    this.path = path;
    this.routeType = routeType;
    this.requiredPermissions = requiredPermissions;
    this.isDynamic = path.includes('[') || path.includes(':');
  }

  public static create(path: string, routeType: RouteType, requiredPermissions: string[] = []): RouteDefinition {
    return new RouteDefinition(path, routeType, requiredPermissions);
  }
}

/**
 * ModuleDefinition Value Object
 */
export class ModuleDefinition {
  public readonly moduleId: string;
  public readonly moduleName: string;
  public readonly version: string;
  public readonly status: ModuleStatus;
  public readonly targetApplications: string[];

  private constructor(moduleId: string, moduleName: string, version: string, status: ModuleStatus, targetApplications: string[]) {
    this.moduleId = moduleId;
    this.moduleName = moduleName;
    this.version = version;
    this.status = status;
    this.targetApplications = targetApplications;
  }

  public static create(props: {
    moduleId: string;
    moduleName: string;
    version?: string;
    status?: ModuleStatus;
    targetApplications?: string[];
  }): ModuleDefinition {
    return new ModuleDefinition(
      props.moduleId,
      props.moduleName,
      props.version || '1.0.0',
      props.status || ModuleStatus.ACTIVE,
      props.targetApplications || ['Admin Portal', 'Restaurant Portal', 'POS', 'Kitchen Display', 'Customer Portal']
    );
  }
}

/**
 * ApiRequest Value Object
 */
export class ApiRequest {
  public readonly endpoint: string;
  public readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  public readonly headers: Record<string, string>;
  public readonly body?: unknown;
  public readonly correlationId: string;

  private constructor(props: {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown;
    correlationId?: string;
  }) {
    this.endpoint = props.endpoint;
    this.method = props.method || 'GET';
    this.correlationId = props.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.headers = {
      'Content-Type': 'application/json',
      'x-correlation-id': this.correlationId,
      ...(props.headers || {}),
    };
    this.body = props.body;
  }

  public static create(props: {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown;
    correlationId?: string;
  }): ApiRequest {
    return new ApiRequest(props);
  }
}

/**
 * ApiResponse Value Object
 */
export class ApiResponse<T = unknown> {
  public readonly statusCode: number;
  public readonly data: T;
  public readonly correlationId: string;
  public readonly timestamp: Date;
  public readonly isSuccess: boolean;

  private constructor(statusCode: number, data: T, correlationId: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.correlationId = correlationId;
    this.timestamp = new Date();
    this.isSuccess = statusCode >= 200 && statusCode < 300;
  }

  public static success<T>(data: T, statusCode: number = 200, correlationId: string = 'sys'): ApiResponse<T> {
    return new ApiResponse(statusCode, data, correlationId);
  }

  public static error<T>(errorData: T, statusCode: number = 400, correlationId: string = 'sys'): ApiResponse<T> {
    return new ApiResponse(statusCode, errorData, correlationId);
  }
}

/**
 * QueryKey Value Object
 */
export class QueryKey {
  public readonly keys: readonly unknown[];

  private constructor(keys: readonly unknown[]) {
    this.keys = keys;
  }

  public static create(...keys: unknown[]): QueryKey {
    return new QueryKey(keys);
  }

  public toString(): string {
    return JSON.stringify(this.keys);
  }
}

/**
 * CachePolicy Value Object
 */
export class CachePolicy {
  public readonly staleTimeMs: number;
  public readonly gcTimeMs: number;
  public readonly retryAttempts: number;
  public readonly enableOfflineCache: boolean;

  private constructor(staleTimeMs: number = 300000, gcTimeMs: number = 900000, retryAttempts: number = 3, enableOfflineCache: boolean = true) {
    this.staleTimeMs = staleTimeMs;
    this.gcTimeMs = gcTimeMs;
    this.retryAttempts = retryAttempts;
    this.enableOfflineCache = enableOfflineCache;
  }

  public static create(props: {
    staleTimeMs?: number;
    gcTimeMs?: number;
    retryAttempts?: number;
    enableOfflineCache?: boolean;
  }): CachePolicy {
    return new CachePolicy(props.staleTimeMs, props.gcTimeMs, props.retryAttempts, props.enableOfflineCache);
  }

  public static defaultPolicy(): CachePolicy {
    return new CachePolicy(300000, 900000, 3, true);
  }
}

/**
 * NavigationState Value Object
 */
export class NavigationState {
  public readonly currentPath: string;
  public readonly previousPath?: string;
  public readonly historyLength: number;

  private constructor(currentPath: string, previousPath?: string, historyLength: number = 1) {
    this.currentPath = currentPath;
    this.previousPath = previousPath;
    this.historyLength = historyLength;
  }

  public static create(currentPath: string, previousPath?: string, historyLength?: number): NavigationState {
    return new NavigationState(currentPath, previousPath, historyLength);
  }
}

/**
 * PageMetadata Value Object
 */
export class PageMetadata {
  public readonly title: string;
  public readonly description: string;
  public readonly canonicalUrl?: string;

  private constructor(title: string, description: string, canonicalUrl?: string) {
    this.title = title;
    this.description = description;
    this.canonicalUrl = canonicalUrl;
  }

  public static create(title: string, description: string, canonicalUrl?: string): PageMetadata {
    return new PageMetadata(title, description, canonicalUrl);
  }
}

/**
 * FeatureModule Value Object
 */
export class FeatureModule {
  public readonly definition: ModuleDefinition;
  public readonly routes: RouteDefinition[];

  private constructor(definition: ModuleDefinition, routes: RouteDefinition[]) {
    this.definition = definition;
    this.routes = routes;
  }

  public static create(definition: ModuleDefinition, routes: RouteDefinition[]): FeatureModule {
    return new FeatureModule(definition, routes);
  }
}
