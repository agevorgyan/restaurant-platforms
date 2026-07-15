import { prisma } from '../client';
import { Prisma } from '@prisma/client';

export class TenantRepository {
  async findById(id: string) {
    return prisma.tenant.findUnique({ where: { id } });
  }

  async findByDomain(domain: string) {
    return prisma.tenant.findUnique({ where: { domain } });
  }

  async create(data: Prisma.TenantCreateInput) {
    return prisma.tenant.create({ data });
  }
}
