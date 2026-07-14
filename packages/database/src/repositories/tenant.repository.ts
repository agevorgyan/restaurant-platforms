import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tenant, Prisma } from '@prisma/client';

@Injectable()
export class TenantRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({ where: { slug } });
  }

  async findByDomain(domain: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({ where: { domain } });
  }

  async create(data: Prisma.TenantCreateInput): Promise<Tenant> {
    return this.prisma.tenant.create({ data });
  }

  async update(id: string, data: Prisma.TenantUpdateInput): Promise<Tenant> {
    return this.prisma.tenant.update({ where: { id }, data });
  }
}
