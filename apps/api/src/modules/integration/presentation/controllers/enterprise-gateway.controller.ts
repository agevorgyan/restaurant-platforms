import { Controller, Get, Post, Query } from '@nestjs/common';
import { RoutingService } from '../../application/services';
import { RouteDefinition, GatewayHealth, RouteStatistics } from '../../application/read-models';

@Controller('gateway')
export class EnterpriseApiGatewayController {
  constructor(private readonly routingService: RoutingService) {}

  @Get('routes')
  async getRoutes(): Promise<RouteDefinition[]> {
    return this.routingService.getRoutes();
  }

  @Get('health')
  async getHealth(): Promise<GatewayHealth> {
    return this.routingService.getHealth();
  }

  @Get('statistics')
  async getStatistics(): Promise<RouteStatistics[]> {
    return this.routingService.getStatistics();
  }

  @Post('routes/reload')
  async reloadRoutes(): Promise<{ status: string; message: string }> {
    this.routingService.reloadRoutes();
    return {
      status: 'SUCCESS',
      message: 'Gateway routes reloaded successfully.'
    };
  }
}
