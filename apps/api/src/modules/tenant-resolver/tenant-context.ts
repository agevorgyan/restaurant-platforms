import { AsyncLocalStorage } from 'node:async_hooks';
import { TenantContextData } from '@saas/types';

/**
 * TenantContext provides static ambient access to the current request's tenant,
 * restaurant, and execution context properties using Node's AsyncLocalStorage.
 *
 * This decouples controllers, services, and repositories from Express request objects.
 */
export class TenantContext {
  private static readonly storage = new AsyncLocalStorage<TenantContextData>();

  /**
   * Run an asynchronous function within a bound tenancy context.
   */
  static run<T>(data: TenantContextData, fn: () => T): T {
    return this.storage.run(data, fn);
  }

  /**
   * Retrieve the current execution context storage payload.
   */
  static getStore(): TenantContextData | undefined {
    return this.storage.getStore();
  }

  /**
   * Safe getter for the current resolved tenant ID.
   */
  static getTenantId(): string | undefined {
    return this.getStore()?.tenantId;
  }

  /**
   * Safe getter for the current resolved tenant domain/subdomain.
   */
  static getTenantDomain(): string | undefined {
    return this.getStore()?.tenantDomain;
  }

  /**
   * Safe getter for the active restaurant ID being queried.
   */
  static getRestaurantId(): string | undefined {
    return this.getStore()?.restaurantId;
  }

  /**
   * Safe getter for the authenticated user ID.
   */
  static getUserId(): string | undefined {
    return this.getStore()?.userId;
  }

  /**
   * Safe getter for the unique correlation ID of the request (for tracing).
   */
  static getCorrelationId(): string | undefined {
    return this.getStore()?.correlationId;
  }
}
