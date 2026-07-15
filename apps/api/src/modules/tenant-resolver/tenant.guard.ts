import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant-context';
import { TenantMismatchException, TenantNotFoundException, RestaurantNotFoundException } from './tenant-resolver.types';
import { Logger } from '@saas/logger';

/**
 * Access Guards for multi-tenant boundary isolation.
 * Protects endpoints from cross-tenant data leaks and verifies context scopes.
 */
export class TenantGuards {
  private static readonly logger = new Logger('TenantGuards');

  /**
   * Guard: Enforces that a valid tenant has been resolved for the current context.
   */
  static requireTenant(req: Request, res: Response, next: NextFunction) {
    const tenantId = TenantContext.getTenantId();
    if (!tenantId) {
      throw new TenantNotFoundException('Active tenant context is required but was not resolved');
    }
    next();
  }

  /**
   * Guard: Enforces that a valid restaurant has been resolved for the current context.
   */
  static requireRestaurant(req: Request, res: Response, next: NextFunction) {
    const restaurantId = TenantContext.getRestaurantId();
    if (!restaurantId) {
      throw new RestaurantNotFoundException('Active restaurant context is required for this route');
    }
    next();
  }

  /**
   * Guard: Hardens the tenant security boundary.
   * Compares the authenticated user's tenantId with the resolved request tenantId.
   * If there is a mismatch, it triggers an alarm block and rejects the request immediately.
   */
  static enforceTenantAccess(req: Request, res: Response, next: NextFunction) {
    const resolvedTenantId = TenantContext.getTenantId();
    if (!resolvedTenantId) {
      throw new TenantNotFoundException('Cannot enforce tenancy boundary: no active tenant resolved');
    }

    const user = (req as any).user;
    if (!user) {
      TenantGuards.logger.warn('Access boundary enforced on unauthenticated request. Rejecting as unauthorized.', {
        path: req.path,
        resolvedTenantId,
      });
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required to verify tenant access boundaries.',
        },
      });
      return;
    }

    // Strict row-level/tenant-level identity matching
    if (user.tenantId !== resolvedTenantId) {
      TenantGuards.logger.error('CRITICAL: Cross-tenant data leak attempt blocked!', undefined, {
        userId: user.id,
        userTenantId: user.tenantId,
        requestedTenantId: resolvedTenantId,
        path: req.path,
        correlationId: (req as any).correlationId,
      });
      
      throw new TenantMismatchException('Access denied: Requested resource does not belong to your organization.');
    }

    next();
  }
}
