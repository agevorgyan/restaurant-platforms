import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  SmsDeliveryService,
  SmsGatewayRegistry,
  SmsTrackingService,
  GatewayHealthService
} from '../../application/services';
import { 
  SmsMessageRecord,
  SmsDelivery,
  SmsStatistics,
  GatewayHealth
} from '../../application/read-models';

@Controller('notifications/sms')
export class EnterpriseSmsController {
  constructor(
    private readonly deliveryService: SmsDeliveryService,
    private readonly registry: SmsGatewayRegistry,
    private readonly tracking: SmsTrackingService,
    private readonly healthService: GatewayHealthService
  ) {}

  @Get()
  async getSmsMessages(): Promise<SmsDelivery[]> {
    return [];
  }

  @Get('providers')
  async getProviders(): Promise<string[]> {
    return this.registry.getAllGateways();
  }

  @Get('statistics')
  async getStatistics(): Promise<SmsStatistics> {
    return this.tracking.getStatistics();
  }

  @Get('health')
  async getHealth(@Param('gatewayName') gatewayName: string): Promise<GatewayHealth> {
    return this.healthService.getHealth(gatewayName || 'TWILIO');
  }

  @Post('test')
  async sendTestSms(
    @Body() payload: SmsMessageRecord
  ): Promise<SmsDelivery> {
    return this.deliveryService.dispatchSms(payload);
  }
}
