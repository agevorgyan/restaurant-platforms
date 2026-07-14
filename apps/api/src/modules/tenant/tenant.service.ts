import { prisma, Tenant, Restaurant } from '@saas/database';

export class TenantService {
  /**
   * Resolves a tenant by hostname.
   * Matches against custom domain first, then subdomain.
   */
  async resolveByHostname(hostname: string, baseDomain: string): Promise<Tenant | null> {
    // 1. Try to match custom domain directly
    let tenant = await prisma.tenant.findUnique({
      where: { domain: hostname }
    });

    if (tenant) return tenant;

    // 2. Extract subdomain and match
    if (hostname.endsWith(`.${baseDomain}`)) {
      const subdomain = hostname.replace(`.${baseDomain}`, '');
      tenant = await prisma.tenant.findUnique({
        where: { subdomain }
      });
    }

    // 3. Optional: fallback if exact subdomain matches hostname
    if (!tenant) {
      tenant = await prisma.tenant.findUnique({
        where: { subdomain: hostname }
      });
    }

    return tenant;
  }

  /**
   * Resolves a restaurant. For example, if a custom domain maps directly to a restaurant.
   * Or if a tenant only has one restaurant, return that.
   * Or by explicitly passing a restaurant slug or id.
   */
  async resolveRestaurant(tenantId: string, restaurantIdentifier?: string): Promise<Restaurant | null> {
    if (restaurantIdentifier) {
      // First try to match by id or slug
      const restaurant = await prisma.restaurant.findFirst({
        where: {
          tenantId,
          OR: [
            { id: restaurantIdentifier },
            { slug: restaurantIdentifier }
          ]
        }
      });
      if (restaurant) return restaurant;
    }

    // Default to the first restaurant of the tenant
    return prisma.restaurant.findFirst({
      where: { tenantId }
    });
  }
}
