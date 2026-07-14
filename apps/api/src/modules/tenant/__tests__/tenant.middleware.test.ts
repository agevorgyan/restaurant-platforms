import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tenantResolver, TenantContextRequest } from '../tenant.middleware';
import { TenantService } from '../tenant.service';
import { Response, NextFunction } from 'express';

vi.mock('../tenant.service');

describe('tenantResolver Middleware', () => {
  let mockReq: Partial<TenantContextRequest>;
  let mockRes: Partial<Response>;
  let nextFunction: ReturnType<typeof vi.fn>;
  let middleware: ReturnType<typeof tenantResolver>;

  beforeEach(() => {
    vi.clearAllMocks();
    middleware = tenantResolver('example.com');
    
    mockReq = {
      hostname: 'test.example.com',
      headers: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    nextFunction = vi.fn();
  });

  it('should resolve tenant and assign to request context', async () => {
    const mockTenant = { id: 'tenant-1', name: 'Test Tenant' };
    const mockRestaurant = { id: 'rest-1', name: 'Test Rest' };

    vi.mocked(TenantService.prototype.resolveByHostname).mockResolvedValue(mockTenant as any);
    vi.mocked(TenantService.prototype.resolveRestaurant).mockResolvedValue(mockRestaurant as any);

    await middleware(mockReq as TenantContextRequest, mockRes as Response, nextFunction as NextFunction);

    expect(TenantService.prototype.resolveByHostname).toHaveBeenCalledWith('test.example.com', 'example.com');
    expect(TenantService.prototype.resolveRestaurant).toHaveBeenCalledWith('tenant-1', undefined);
    
    expect(mockReq.tenantContext).toBeDefined();
    expect(mockReq.tenantContext?.tenant).toEqual(mockTenant);
    expect(mockReq.tenantContext?.restaurant).toEqual(mockRestaurant);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 404 if tenant is not found', async () => {
    vi.mocked(TenantService.prototype.resolveByHostname).mockResolvedValue(null);

    await middleware(mockReq as TenantContextRequest, mockRes as Response, nextFunction as NextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Tenant not found for hostname: test.example.com' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should resolve restaurant by header if provided', async () => {
    const mockTenant = { id: 'tenant-1' };
    mockReq.headers = { 'x-restaurant-slug': 'my-slug' };

    vi.mocked(TenantService.prototype.resolveByHostname).mockResolvedValue(mockTenant as any);

    await middleware(mockReq as TenantContextRequest, mockRes as Response, nextFunction as NextFunction);

    expect(TenantService.prototype.resolveRestaurant).toHaveBeenCalledWith('tenant-1', 'my-slug');
  });
});
