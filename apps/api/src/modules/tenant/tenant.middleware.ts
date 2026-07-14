import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';
import { Tenant, Restaurant } from '@saas/database';

export interface TenantContextRequest extends Request {
  tenantContext?: {
    tenant: Tenant;
    restaurant?: Restaurant | null;
  };
}

export const tenantResolver = (baseDomain: string) => {
  const tenantService = new TenantService();

  return async (req: TenantContextRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hostname = req.hostname;
      const restaurantIdentifier = req.headers['x-restaurant-id'] as string | undefined || req.headers['x-restaurant-slug'] as string | undefined;

      const tenant = await tenantService.resolveByHostname(hostname, baseDomain);

      if (!tenant) {
        res.status(404).json({ error: 'Tenant not found for hostname: ' + hostname });
        return;
      }

      const restaurant = await tenantService.resolveRestaurant(tenant.id, restaurantIdentifier);

      req.tenantContext = {
        tenant,
        restaurant,
      };

      next();
    } catch (error) {
      console.error('Tenant resolution error:', error);
      res.status(500).json({ error: 'Internal server error during tenant resolution' });
    }
  };
};
