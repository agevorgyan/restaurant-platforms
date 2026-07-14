export * from './prisma/prisma.service';
export * from './repositories/tenant.repository';
export type { Tenant, User, Session, Restaurant, Prisma } from '@saas/db';

import { PrismaClient } from '@saas/db';
export const prisma = new PrismaClient();

export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    return false;
  }
}

export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
