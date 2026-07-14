import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TenantService } from '../tenant.service';
import { prisma } from '@saas/database';

// Mock the prisma client
vi.mock('@saas/database', () => {
  return {
    prisma: {
      tenant: {
        findUnique: vi.fn(),
      },
      restaurant: {
        findFirst: vi.fn(),
      },
    },
  };
});

describe('TenantService', () => {
  let tenantService: TenantService;
  const BASE_DOMAIN = 'example.com';

  beforeEach(() => {
    vi.clearAllMocks();
    tenantService = new TenantService();
  });

  describe('resolveByHostname', () => {
    it('should resolve tenant by exact custom domain match first', async () => {
      const mockTenant = { id: 'tenant-1', domain: 'custom.com' };
      vi.mocked(prisma.tenant.findUnique).mockResolvedValueOnce(mockTenant as any);

      const result = await tenantService.resolveByHostname('custom.com', BASE_DOMAIN);

      expect(prisma.tenant.findUnique).toHaveBeenCalledWith({ where: { domain: 'custom.com' } });
      expect(result).toEqual(mockTenant);
    });

    it('should resolve tenant by subdomain if domain does not match', async () => {
      const mockTenant = { id: 'tenant-2', subdomain: 'mytenant' };
      vi.mocked(prisma.tenant.findUnique)
        .mockResolvedValueOnce(null) // first try custom domain
        .mockResolvedValueOnce(mockTenant as any); // second try subdomain

      const result = await tenantService.resolveByHostname(`mytenant.${BASE_DOMAIN}`, BASE_DOMAIN);

      expect(prisma.tenant.findUnique).toHaveBeenNthCalledWith(1, { where: { domain: `mytenant.${BASE_DOMAIN}` } });
      expect(prisma.tenant.findUnique).toHaveBeenNthCalledWith(2, { where: { subdomain: 'mytenant' } });
      expect(result).toEqual(mockTenant);
    });

    it('should return null if no tenant matches', async () => {
      vi.mocked(prisma.tenant.findUnique).mockResolvedValue(null);

      const result = await tenantService.resolveByHostname('unknown.com', BASE_DOMAIN);

      expect(result).toBeNull();
    });
  });

  describe('resolveRestaurant', () => {
    it('should resolve restaurant by slug or id if identifier is provided', async () => {
      const mockRestaurant = { id: 'rest-1', slug: 'my-rest', tenantId: 'tenant-1' };
      vi.mocked(prisma.restaurant.findFirst).mockResolvedValueOnce(mockRestaurant as any);

      const result = await tenantService.resolveRestaurant('tenant-1', 'my-rest');

      expect(prisma.restaurant.findFirst).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-1',
          OR: [{ id: 'my-rest' }, { slug: 'my-rest' }],
        },
      });
      expect(result).toEqual(mockRestaurant);
    });

    it('should resolve the first restaurant if no identifier is provided', async () => {
      const mockRestaurant = { id: 'rest-2', tenantId: 'tenant-1' };
      vi.mocked(prisma.restaurant.findFirst).mockResolvedValueOnce(mockRestaurant as any);

      const result = await tenantService.resolveRestaurant('tenant-1');

      expect(prisma.restaurant.findFirst).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
      });
      expect(result).toEqual(mockRestaurant);
    });
  });
});
