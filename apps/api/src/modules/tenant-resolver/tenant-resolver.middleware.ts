import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { TenantResolverService } from './tenant-resolver.service';
import { TenantContext } from './tenant-context';
import { TenantResolutionException } from './tenant-resolver.types';
import { Logger } from '@saas/logger';

export interface TenantResolverMiddlewareOptions {
  excludePaths?: string[];
}

/**
 * Express middleware to resolve the active Tenant and Restaurant, binding
 * subsequent middleware and route handlers within a clean TenantContext lifecycle.
 */
export function createTenantResolverMiddleware(
  resolverService: TenantResolverService,
  options: TenantResolverMiddlewareOptions = {}
) {
  const logger = new Logger('TenantResolverMiddleware');
  const excludePaths = options.excludePaths || ['/api/health', '/health'];

  return async (req: Request, res: Response, next: NextFunction) => {
    const path = req.path || '';

    // Bypass resolution for public system paths (e.g., health probes)
    if (excludePaths.some((p) => path === p || path.startsWith(p))) {
      return next();
    }

    // Capture standard proxy Host headers or original Host
    const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || req.hostname || '';
    const correlationId = (req.headers['x-correlation-id'] as string) || randomUUID();

    try {
      // 1. Resolve active Tenant
      const resolvedTenant = await resolverService.resolveTenant(
        host,
        req.headers,
        req.query,
        req.cookies || {}
      );

      // 2. Resolve Restaurant ID (if supplied in headers, queries, or REST path parts)
      let restaurantIdInput = (req.headers['x-restaurant-id'] as string) || (req.query.restaurantId as string);

      if (!restaurantIdInput) {
        // Fallback: Parse restaurant ID from REST URL pattern /api/restaurants/:restaurantId
        const pathParts = path.split('/');
        const restIndex = pathParts.findIndex((part) => part === 'restaurants');
        if (restIndex !== -1 && pathParts[restIndex + 1]) {
          restaurantIdInput = pathParts[restIndex + 1];
        }
      }

      const restaurantId = await resolverService.resolveRestaurant(
        restaurantIdInput,
        resolvedTenant.tenantId
      );

      // 3. Attach variables to req object for traditional compatibility
      (req as any).tenantId = resolvedTenant.tenantId;
      (req as any).restaurantId = restaurantId;
      (req as any).correlationId = correlationId;

      // 4. Run the subsequent execution block within the AsyncLocalStorage zone
      TenantContext.run(
        {
          tenantId: resolvedTenant.tenantId,
          tenantDomain: resolvedTenant.domain,
          restaurantId,
          userId: (req as any).user?.id,
          correlationId,
        },
        () => {
          // Keep a debug audit log of resolution mapping
          logger.debug('Resolved tenant successfully', {
            tenantId: resolvedTenant.tenantId,
            strategy: resolvedTenant.strategy,
            restaurantId,
            correlationId,
          });
          next();
        }
      );
    } catch (error) {
      if (error instanceof TenantResolutionException) {
        logger.warn('Tenancy resolution blocked client request', {
          path,
          host,
          code: error.code,
          message: error.message,
          correlationId,
        });

        res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            correlationId,
          },
        });
        return;
      }

      logger.error('Unexpected crash during tenant resolution pipeline', error, { correlationId });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred resolving context.',
          correlationId,
        },
      });
    }
  };
}
