import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  EmailDeliveryService,
  EmailProviderRegistry,
  EmailTrackingService,
  ProviderHealthService
} from '../../application/services';
import { 
  EmailMessage,
  EmailDelivery,
  EmailStatistics,
  ProviderHealth
} from '../../application/read-models';

@Controller('notifications/email')
export class EnterpriseEmailController {
  constructor(
    private readonly deliveryService: EmailDeliveryService,
    private readonly registry: EmailProviderRegistry,
    private readonly tracking: EmailTrackingService,
    private readonly healthService: ProviderHealthService
  ) {}

  @Get()
  async getEmails(): Promise<EmailDelivery[]> {
    // Mock return paginated emails
    return [];
  }

  @Get('statistics')
  async getStatistics(): Promise<EmailStatistics> {
    return this.tracking.getStatistics();
  }

  @Get('providers')
  async getProviders(): Promise<string[]> {
    return this.registry.getAllProviders();
  }

  @Get('health')
  async getHealth(@Param('providerName') providerName: string): Promise<ProviderHealth> {
    return this.healthService.getHealth(providerName || 'AWS_SES');
  }

  @Post('test')
  async sendTestEmail(
    @Body() payload: EmailMessage
  ): Promise<EmailDelivery> {
    return this.deliveryService.dispatchEmail(payload, 'test-template', { name: 'Test User' });
  }
}
