import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireTenant, requireRestaurant } from '../tenant.guard';
import { TenantContextRequest } from '../tenant.middleware';
import { Response, NextFunction } from 'express';

describe('Tenant Guards', () => {
  let mockRes: Partial<Response>;
  let nextFunction: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    nextFunction = vi.fn();
  });

  describe('requireTenant', () => {
    it('should call next if tenant exists in context', () => {
      const mockReq = { tenantContext: { tenant: { id: 't-1' } } } as Partial<TenantContextRequest>;
      requireTenant(mockReq as TenantContextRequest, mockRes as Response, nextFunction as NextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 if tenant is missing', () => {
      const mockReq = { tenantContext: {} } as Partial<TenantContextRequest>;
      requireTenant(mockReq as TenantContextRequest, mockRes as Response, nextFunction as NextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Tenant context is required' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('requireRestaurant', () => {
    it('should call next if restaurant exists in context', () => {
      const mockReq = { tenantContext: { restaurant: { id: 'r-1' } } } as Partial<TenantContextRequest>;
      requireRestaurant(mockReq as TenantContextRequest, mockRes as Response, nextFunction as NextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 if restaurant is missing', () => {
      const mockReq = { tenantContext: { tenant: { id: 't-1' } } } as Partial<TenantContextRequest>;
      requireRestaurant(mockReq as TenantContextRequest, mockRes as Response, nextFunction as NextFunction);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Restaurant context is required' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
