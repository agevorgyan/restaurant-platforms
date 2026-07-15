import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TenantResolverService } from './tenant-resolver.service';
import { TenantContext } from './tenant-context';
import { TenantGuards } from './tenant.guard';
import { createTenantResolverMiddleware } from './tenant-resolver.middleware';
import {
  TenantNotFoundException,
  RestaurantNotFoundException,
  TenantMismatchException,
} from './tenant-resolver.types';
import { Request, Response, NextFunction } from 'express';

// Mock Repositories
const mockTenantRepo = {
  findById: vi.fn(),
  findByDomain: vi.fn(),
  create: vi.fn(),
};

const mockRestaurantRepo = {
  findById: vi.fn(),
  findByTenantId: vi.fn(),
  findByIdAndTenantId: vi.fn(),
  create: vi.fn(),
};

describe('Tenant Resolver Engine Suite', () => {
  let resolverService: TenantResolverService;
  const config = {
    primaryDomain: 'saas.com',
    enableSubdomains: true,
    enableCustomDomains: true,
    fallbackTenantId: 'default-tenant-id',
    headerKeys: {
      tenantId: 'x-custom-tenant-id',
      restaurantId: 'x-custom-restaurant-id',
    },
    cookieKeys: {
      tenantId: 'cookie_tenant',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    resolverService = new TenantResolverService(
      config,
      mockTenantRepo as any,
      mockRestaurantRepo as any
    );
  });

  describe('Hostname Parsing Rules', () => {
    it('should correctly parse standard subdomains', () => {
      const parsed = resolverService.parseHost('sub.saas.com');
      expect(parsed.isCustomDomain).toBe(false);
      expect(parsed.subdomain).toBe('sub');
      expect(parsed.domain).toBe('sub.saas.com');
    });

    it('should strip ports and parse hostnames correctly', () => {
      const parsed = resolverService.parseHost('sub.saas.com:3000');
      expect(parsed.isCustomDomain).toBe(false);
      expect(parsed.subdomain).toBe('sub');
      expect(parsed.domain).toBe('sub.saas.com');
    });

    it('should recognize foreign hostnames as custom domains', () => {
      const parsed = resolverService.parseHost('order.restaurant.com');
      expect(parsed.isCustomDomain).toBe(true);
      expect(parsed.subdomain).toBeUndefined();
      expect(parsed.domain).toBe('order.restaurant.com');
    });

    it('should handle raw primary domain as not a custom domain', () => {
      const parsed = resolverService.parseHost('saas.com');
      expect(parsed.isCustomDomain).toBe(false);
      expect(parsed.subdomain).toBeUndefined();
      expect(parsed.domain).toBe('saas.com');
    });
  });

  describe('Tenant Resolution Strategies', () => {
    it('should resolve via custom Tenant ID Header', async () => {
      mockTenantRepo.findById.mockResolvedValue({ id: 'tenant-123', name: 'My Tenant' });

      const res = await resolverService.resolveTenant(
        'saas.com',
        { 'x-custom-tenant-id': 'tenant-123' },
        {},
        {}
      );

      expect(res.tenantId).toBe('tenant-123');
      expect(res.strategy).toBe('header');
      expect(mockTenantRepo.findById).toHaveBeenCalledWith('tenant-123');
    });

    it('should resolve via query params as second priority', async () => {
      mockTenantRepo.findById.mockResolvedValue({ id: 'tenant-456', name: 'Query Tenant' });

      const res = await resolverService.resolveTenant(
        'saas.com',
        {},
        { tenantId: 'tenant-456' },
        {}
      );

      expect(res.tenantId).toBe('tenant-456');
      expect(res.strategy).toBe('query');
      expect(mockTenantRepo.findById).toHaveBeenCalledWith('tenant-456');
    });

    it('should resolve via cookie keys', async () => {
      mockTenantRepo.findById.mockResolvedValue({ id: 'tenant-cookie', name: 'Cookie Tenant' });

      const res = await resolverService.resolveTenant(
        'saas.com',
        {},
        {},
        { cookie_tenant: 'tenant-cookie' }
      );

      expect(res.tenantId).toBe('tenant-cookie');
      expect(res.strategy).toBe('cookie');
    });

    it('should resolve via Subdomain lookup', async () => {
      mockTenantRepo.findByDomain.mockResolvedValue({ id: 'tenant-sub', domain: 'sub' });

      const res = await resolverService.resolveTenant('sub.saas.com', {}, {}, {});

      expect(res.tenantId).toBe('tenant-sub');
      expect(res.strategy).toBe('subdomain');
      expect(res.domain).toBe('sub');
      expect(mockTenantRepo.findByDomain).toHaveBeenCalledWith('sub');
    });

    it('should resolve via Custom Domain lookup', async () => {
      mockTenantRepo.findByDomain.mockResolvedValue({ id: 'tenant-custom', domain: 'bistro.com' });

      const res = await resolverService.resolveTenant('bistro.com', {}, {}, {});

      expect(res.tenantId).toBe('tenant-custom');
      expect(res.strategy).toBe('custom_domain');
      expect(res.domain).toBe('bistro.com');
      expect(mockTenantRepo.findByDomain).toHaveBeenCalledWith('bistro.com');
    });

    it('should fallback to default configured tenant if lookup fails', async () => {
      mockTenantRepo.findByDomain.mockResolvedValue(null);
      mockTenantRepo.findById.mockResolvedValue({ id: 'default-tenant-id', name: 'Fallback' });

      const res = await resolverService.resolveTenant('unknown.saas.com', {}, {}, {});

      expect(res.tenantId).toBe('default-tenant-id');
      expect(res.strategy).toBe('fallback');
    });

    it('should throw TenantNotFoundException if no strategies resolve', async () => {
      mockTenantRepo.findByDomain.mockResolvedValue(null);
      mockTenantRepo.findById.mockResolvedValue(null);
      
      const failingService = new TenantResolverService(
        { primaryDomain: 'saas.com' }, // No fallback configured
        mockTenantRepo as any,
        mockRestaurantRepo as any
      );

      await expect(
        failingService.resolveTenant('unknown.saas.com', {}, {}, {})
      ).rejects.toThrow(TenantNotFoundException);
    });
  });

  describe('Caching Boundary', () => {
    it('should query repository once and fetch subsequent requests from local cache', async () => {
      mockTenantRepo.findByDomain.mockResolvedValue({ id: 'tenant-cached', domain: 'bistro.com' });

      // First execution
      const res1 = await resolverService.resolveTenant('bistro.com', {}, {}, {});
      expect(res1.tenantId).toBe('tenant-cached');

      // Second execution (hits cache)
      const res2 = await resolverService.resolveTenant('bistro.com', {}, {}, {});
      expect(res2.tenantId).toBe('tenant-cached');

      expect(mockTenantRepo.findByDomain).toHaveBeenCalledTimes(1);
    });

    it('should clear cache and re-query database', async () => {
      mockTenantRepo.findByDomain.mockResolvedValue({ id: 'tenant-cached', domain: 'bistro.com' });

      await resolverService.resolveTenant('bistro.com', {}, {}, {});
      resolverService.clearCache();
      await resolverService.resolveTenant('bistro.com', {}, {}, {});

      expect(mockTenantRepo.findByDomain).toHaveBeenCalledTimes(2);
    });
  });

  describe('Restaurant Security Resolution', () => {
    it('should return undefined if restaurant input is empty', async () => {
      const resolved = await resolverService.resolveRestaurant(undefined, 'tenant-id');
      expect(resolved).toBeUndefined();
    });

    it('should resolve and return restaurant ID if it matches tenant', async () => {
      mockRestaurantRepo.findByIdAndTenantId.mockResolvedValue({ id: 'rest-1', tenantId: 'tenant-1' });

      const resolved = await resolverService.resolveRestaurant('rest-1', 'tenant-1');
      expect(resolved).toBe('rest-1');
      expect(mockRestaurantRepo.findByIdAndTenantId).toHaveBeenCalledWith('rest-1', 'tenant-1');
    });

    it('should throw RestaurantNotFoundException if restaurant belongs to another tenant', async () => {
      mockRestaurantRepo.findByIdAndTenantId.mockResolvedValue(null);

      await expect(
        resolverService.resolveRestaurant('rest-1', 'tenant-spy')
      ).rejects.toThrow(RestaurantNotFoundException);
    });
  });

  describe('AsyncLocalStorage Thread-Safe Context Flow', () => {
    it('should set, propagate, and retrieve context keys statically', () => {
      TenantContext.run(
        { tenantId: 'als-tenant', restaurantId: 'als-rest', correlationId: 'tx-99' },
        () => {
          expect(TenantContext.getTenantId()).toBe('als-tenant');
          expect(TenantContext.getRestaurantId()).toBe('als-rest');
          expect(TenantContext.getCorrelationId()).toBe('tx-99');
        }
      );

      // Verify clean memory stack reset
      expect(TenantContext.getTenantId()).toBeUndefined();
    });
  });

  describe('Express Middleware', () => {
    it('should pass transparently for skipped/excluded health paths', async () => {
      const middleware = createTenantResolverMiddleware(resolverService);
      const req = { path: '/api/health' } as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;

      await middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should resolve tenant and restaurant, then bind them in TenantContext', async () => {
      mockTenantRepo.findById.mockResolvedValue({ id: 'tenant-ok' });
      mockRestaurantRepo.findByIdAndTenantId.mockResolvedValue({ id: 'rest-ok' });

      const middleware = createTenantResolverMiddleware(resolverService);
      const req = {
        path: '/api/restaurants/rest-ok/orders',
        headers: { 'x-custom-tenant-id': 'tenant-ok' },
        query: {},
        cookies: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = vi.fn() as NextFunction;

      await middleware(req, res, () => {
        // Run nested checks in context boundary
        expect(TenantContext.getTenantId()).toBe('tenant-ok');
        expect(TenantContext.getRestaurantId()).toBe('rest-ok');
        next();
      });

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Security Guards', () => {
    it('requireTenant should pass if tenant exists in context', () => {
      TenantContext.run({ tenantId: 'tenant-present' }, () => {
        const next = vi.fn();
        TenantGuards.requireTenant({} as Request, {} as Response, next);
        expect(next).toHaveBeenCalled();
      });
    });

    it('requireTenant should throw TenantNotFoundException if context is empty', () => {
      expect(() => {
        TenantGuards.requireTenant({} as Request, {} as Response, vi.fn());
      }).toThrow(TenantNotFoundException);
    });

    it('enforceTenantAccess should succeed if authenticated user is part of tenant', () => {
      TenantContext.run({ tenantId: 'tenant-safe' }, () => {
        const next = vi.fn();
        const req = { user: { id: 'user-1', tenantId: 'tenant-safe' } } as any;
        TenantGuards.enforceTenantAccess(req, {} as Response, next);
        expect(next).toHaveBeenCalled();
      });
    });

    it('enforceTenantAccess should reject with 401 if user is unauthenticated', () => {
      TenantContext.run({ tenantId: 'tenant-safe' }, () => {
        const resJson = vi.fn();
        const res = { status: vi.fn().mockReturnValue({ json: resJson }) } as any;
        TenantGuards.enforceTenantAccess({} as any, res, vi.fn());
        expect(res.status).toHaveBeenCalledWith(401);
      });
    });

    it('enforceTenantAccess should throw TenantMismatchException if user has mismatched tenant', () => {
      TenantContext.run({ tenantId: 'tenant-one' }, () => {
        const req = { user: { id: 'spy-user', tenantId: 'tenant-two' } } as any;
        expect(() => {
          TenantGuards.enforceTenantAccess(req, {} as Response, vi.fn());
        }).toThrow(TenantMismatchException);
      });
    });
  });
});
