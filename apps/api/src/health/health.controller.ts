import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => ({ api: { status: 'up' } }),
      () => this.prismaHealthIndicator.isHealthy('database'),
    ]);
  }
}
