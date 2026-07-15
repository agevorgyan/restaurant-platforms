import { Tenant, Restaurant, TenantResolverOptions } from '@saas/types';

export interface TenantResolverConfig extends TenantResolverOptions {
  primaryDomain: string;
}

export class TenantResolutionException extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'TenantResolutionException';
  }
}

export class TenantNotFoundException extends TenantResolutionException {
  constructor(message = 'Tenant not found', details?: Record<string, any>) {
    super(404, message, 'TENANT_NOT_FOUND', details);
  }
}

export class RestaurantNotFoundException extends TenantResolutionException {
  constructor(message = 'Restaurant not found or does not belong to this tenant', details?: Record<string, any>) {
    super(404, message, 'RESTAURANT_NOT_FOUND', details);
  }
}

export class InvalidDomainException extends TenantResolutionException {
  constructor(message = 'Invalid hostname or domain format', details?: Record<string, any>) {
    super(400, message, 'INVALID_DOMAIN_FORMAT', details);
  }
}

export class TenantMismatchException extends TenantResolutionException {
  constructor(message = 'Authenticated user does not belong to the requested tenant', details?: Record<string, any>) {
    super(403, message, 'TENANT_MISMATCH', details);
  }
}
