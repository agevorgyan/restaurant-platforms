import { TenantRepository, RestaurantRepository } from '@saas/database';
import { Logger } from '@saas/logger';
import { TenantResolverConfig, TenantNotFoundException, RestaurantNotFoundException } from './tenant-resolver.types';
import { TenantResolverResult } from '@saas/types';

export class TenantResolverService {
  private readonly logger = new Logger('TenantResolverService');
  
  // In-memory cache for production scale
  private readonly cache = new Map<string, { result: TenantResolverResult; expiresAt: number }>();
  private readonly cacheTTL = 30000; // 30 seconds internal cache TTL

  constructor(
    private readonly config: TenantResolverConfig,
    private readonly tenantRepo: TenantRepository,
    private readonly restaurantRepo: RestaurantRepository
  ) {}

  /**
   * Resolves the tenant from incoming request parameters.
   */
  async resolveTenant(
    hostname: string,
    headers: Record<string, any>,
    query: Record<string, any>,
    cookies: Record<string, any>
  ): Promise<TenantResolverResult> {
    const cacheKey = JSON.stringify({ hostname, headers, query, cookies });
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.result;
    }

    this.logger.debug('Attempting to resolve tenant', { hostname });

    // Strategy 1: Header Resolution (e.g. X-Tenant-ID)
    const headerTenantId = this.config.headerKeys?.tenantId 
      ? headers[this.config.headerKeys.tenantId.toLowerCase()]
      : headers['x-tenant-id'];
    
    if (headerTenantId && typeof headerTenantId === 'string') {
      const tenant = await this.tenantRepo.findById(headerTenantId);
      if (tenant) {
        const result: TenantResolverResult = { tenantId: tenant.id, strategy: 'header' };
        this.cacheResult(cacheKey, result);
        return result;
      }
    }

    // Strategy 2: Query Parameter Resolution (e.g. ?tenantId=...)
    const queryTenantId = query.tenantId || query.tenant;
    if (queryTenantId && typeof queryTenantId === 'string') {
      const tenant = await this.tenantRepo.findById(queryTenantId);
      if (tenant) {
        const result: TenantResolverResult = { tenantId: tenant.id, strategy: 'query' };
        this.cacheResult(cacheKey, result);
        return result;
      }
    }

    // Strategy 3: Cookie Resolution (e.g. tenant_id)
    const cookieTenantId = this.config.cookieKeys?.tenantId
      ? cookies[this.config.cookieKeys.tenantId]
      : cookies['tenant_id'];
    if (cookieTenantId && typeof cookieTenantId === 'string') {
      const tenant = await this.tenantRepo.findById(cookieTenantId);
      if (tenant) {
        const result: TenantResolverResult = { tenantId: tenant.id, strategy: 'cookie' };
        this.cacheResult(cacheKey, result);
        return result;
      }
    }

    // Strategy 4: Hostname Domain & Subdomain Parsing
    if (hostname) {
      const parsedHost = this.parseHost(hostname);

      if (parsedHost.isCustomDomain && this.config.enableCustomDomains !== false) {
        // Look up by custom domain
        const tenant = await this.tenantRepo.findByDomain(parsedHost.domain);
        if (tenant) {
          const result: TenantResolverResult = {
            tenantId: tenant.id,
            strategy: 'custom_domain',
            domain: parsedHost.domain,
          };
          this.cacheResult(cacheKey, result);
          return result;
        }
      } else if (parsedHost.subdomain && this.config.enableSubdomains !== false) {
        // Look up by subdomain
        const tenant = await this.tenantRepo.findByDomain(parsedHost.subdomain);
        if (tenant) {
          const result: TenantResolverResult = {
            tenantId: tenant.id,
            strategy: 'subdomain',
            domain: parsedHost.subdomain,
          };
          this.cacheResult(cacheKey, result);
          return result;
        }
      }
    }

    // Strategy 5: Fallback Option
    if (this.config.fallbackTenantId) {
      const tenant = await this.tenantRepo.findById(this.config.fallbackTenantId);
      if (tenant) {
        const result: TenantResolverResult = {
          tenantId: tenant.id,
          strategy: 'fallback',
        };
        this.cacheResult(cacheKey, result);
        return result;
      }
    }

    this.logger.warn('Failed to resolve tenant for request', { hostname });
    throw new TenantNotFoundException(`Could not resolve active tenant for hostname: ${hostname}`);
  }

  /**
   * Resolves the restaurant and guarantees it belongs to the active tenant context.
   */
  async resolveRestaurant(
    restaurantIdInput: string | undefined,
    tenantId: string
  ): Promise<string | undefined> {
    if (!restaurantIdInput) {
      return undefined;
    }

    this.logger.debug('Resolving restaurant', { restaurantIdInput, tenantId });

    const restaurant = await this.restaurantRepo.findByIdAndTenantId(restaurantIdInput, tenantId);
    if (!restaurant) {
      this.logger.warn('Restaurant resolution mismatch or not found', { restaurantIdInput, tenantId });
      throw new RestaurantNotFoundException(`Restaurant ${restaurantIdInput} not found under tenant ${tenantId}`);
    }

    return restaurant.id;
  }

  /**
   * Parser to extract subdomains and custom domains while handling port extensions gracefully.
   */
  parseHost(host: string): { isCustomDomain: boolean; subdomain?: string; domain: string } {
    const cleanHost = host.split(':')[0].toLowerCase();
    const primaryDomain = this.config.primaryDomain.split(':')[0].toLowerCase();

    if (cleanHost === primaryDomain) {
      return { isCustomDomain: false, domain: cleanHost };
    }

    if (cleanHost.endsWith(`.${primaryDomain}`)) {
      const subdomain = cleanHost.substring(0, cleanHost.length - primaryDomain.length - 1);
      return { isCustomDomain: false, subdomain, domain: cleanHost };
    }

    return { isCustomDomain: true, domain: cleanHost };
  }

  private cacheResult(key: string, result: TenantResolverResult) {
    this.cache.set(key, {
      result,
      expiresAt: Date.now() + this.cacheTTL,
    });
  }

  /**
   * Direct clear of the memory resolution cache (essential for admin events or tests).
   */
  clearCache() {
    this.cache.clear();
  }
}
