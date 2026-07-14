import { prisma } from './client';

export async function checkDatabaseHealth(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    console.warn('Database health check skipped: DATABASE_URL is not set.');
    return false;
  }
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
