export interface Tenant {
  id: string;
  name: string;
  domain: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Restaurant {
  id: string;
  tenantId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantResolverOptions {
  primaryDomain: string; // e.g., 'localhost:3000' or 'saas.com'
  enableSubdomains?: boolean;
  enableCustomDomains?: boolean;
  headerKeys?: {
    tenantId?: string;
    subdomain?: string;
    customDomain?: string;
    restaurantId?: string;
  };
  cookieKeys?: {
    tenantId?: string;
    restaurantId?: string;
  };
  fallbackTenantId?: string;
}

export interface TenantContextData {
  tenantId?: string;
  tenantDomain?: string;
  restaurantId?: string;
  userId?: string;
  correlationId?: string;
}

export interface TenantResolverResult {
  tenantId: string;
  strategy: 'subdomain' | 'custom_domain' | 'header' | 'query' | 'cookie' | 'fallback';
  domain?: string;
}
