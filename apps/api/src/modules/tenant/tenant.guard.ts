import { Response, NextFunction } from 'express';
import { TenantContextRequest } from './tenant.middleware';

/**
 * Middleware to ensure a tenant context is resolved.
 */
export const requireTenant = (req: TenantContextRequest, res: Response, next: NextFunction): void => {
  if (!req.tenantContext || !req.tenantContext.tenant) {
    res.status(403).json({ error: 'Tenant context is required' });
    return;
  }
  next();
};

/**
 * Middleware to ensure a restaurant context is resolved.
 */
export const requireRestaurant = (req: TenantContextRequest, res: Response, next: NextFunction): void => {
  if (!req.tenantContext || !req.tenantContext.restaurant) {
    res.status(403).json({ error: 'Restaurant context is required' });
    return;
  }
  next();
};
