import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { 
  PushDeliveryService,
  PushProviderRegistry,
  DeviceRegistrationService,
  PushTrackingService,
  ProviderHealthService
} from '../../application/services';
import { 
  PushMessage,
  PushDelivery,
  PushStatistics,
  ProviderHealth,
  RegisteredDevice
} from '../../application/read-models';

@Controller('notifications/push')
export class EnterprisePushController {
  constructor(
    private readonly deliveryService: PushDeliveryService,
    private readonly registry: PushProviderRegistry,
    private readonly registrationService: DeviceRegistrationService,
    private readonly tracking: PushTrackingService,
    private readonly healthService: ProviderHealthService
  ) {}

  @Get()
  async getPushMessages(): Promise<PushDelivery[]> {
    return [];
  }

  @Get('providers')
  async getProviders(): Promise<string[]> {
    return this.registry.getAllProviders();
  }

  @Get('statistics')
  async getStatistics(): Promise<PushStatistics> {
    return this.tracking.getStatistics();
  }

  @Get('health')
  async getHealth(@Param('providerName') providerName: string): Promise<ProviderHealth> {
    return this.healthService.getHealth(providerName || 'FCM');
  }

  @Post('test')
  async sendTestPush(
    @Body() payload: PushMessage
  ): Promise<PushDelivery> {
    return this.deliveryService.dispatchPush(payload);
  }

  @Post('register-device')
  async registerDevice(@Body() device: RegisteredDevice): Promise<{ status: string }> {
    await this.registrationService.registerDevice(device);
    return { status: 'REGISTERED' };
  }

  @Delete('register-device/:token')
  async unregisterDevice(@Param('token') token: string): Promise<{ status: string }> {
    await this.registrationService.unregisterDevice(token);
    return { status: 'UNREGISTERED' };
  }
}
