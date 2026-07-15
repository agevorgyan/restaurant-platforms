import { prisma } from '../client';
import { Prisma } from '@prisma/client';

export class RestaurantRepository {
  async findById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
      include: { tenant: true },
    });
  }

  async findByTenantId(tenantId: string) {
    return prisma.restaurant.findMany({
      where: { tenantId },
    });
  }

  async findByIdAndTenantId(id: string, tenantId: string) {
    return prisma.restaurant.findFirst({
      where: { id, tenantId },
    });
  }

  async create(data: Prisma.RestaurantCreateInput) {
    return prisma.restaurant.create({ data });
  }
}
