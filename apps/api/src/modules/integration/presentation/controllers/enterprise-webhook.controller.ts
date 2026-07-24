import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { 
  WebhookPublisher, 
  WebhookReplayService, 
  DeadLetterWebhookService,
  WebhookReceiver
} from '../../application/services';
import { 
  WebhookSubscription, 
  WebhookStatistics, 
  FailedWebhook 
} from '../../application/read-models';

@Controller('webhooks')
export class EnterpriseWebhookController {
  constructor(
    private readonly webhookPublisher: WebhookPublisher,
    private readonly webhookReplayService: WebhookReplayService,
    private readonly dlqService: DeadLetterWebhookService,
    private readonly receiver: WebhookReceiver
  ) {}

  @Get()
  async getInfo(): Promise<{ status: string; version: string }> {
    return { status: 'ONLINE', version: '1.0.0' };
  }

  @Get('subscriptions')
  async getSubscriptions(@Query('tenantId') tenantId: string): Promise<WebhookSubscription[]> {
    return [{
      subscriptionId: 'sub-1',
      tenantId: tenantId || 'tenant-001',
      endpointUrl: 'https://api.partner.com/webhooks/restaurant',
      subscribedEvents: ['Order.Created', 'Menu.Updated'],
      secretHash: 'hash-abc',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    }];
  }

  @Get('health')
  async getHealth(): Promise<{ status: string; dlqSize: number }> {
    return {
      status: 'HEALTHY',
      dlqSize: this.dlqService.getDeadLetters().length
    };
  }

  @Get('statistics')
  async getStatistics(@Query('tenantId') tenantId: string): Promise<WebhookStatistics> {
    return {
      tenantId: tenantId || 'global',
      totalDeliveries24h: 5000,
      successfulDeliveries24h: 4990,
      failedDeliveries24h: 10,
      averageLatencyMs: 150
    };
  }

  @Post('test')
  async testWebhookDelivery(@Body() payload: { endpointUrl: string; secret: string }): Promise<{ success: boolean }> {
    const sub: WebhookSubscription = {
      subscriptionId: 'test-sub',
      tenantId: 'test-tenant',
      endpointUrl: payload.endpointUrl,
      subscribedEvents: ['System.Ping'],
      secretHash: payload.secret,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const delivery = await this.webhookPublisher.publish(sub, 'ping-event', { message: 'Ping' });
    return { success: delivery.status === 'SUCCESS' };
  }

  @Post('replay')
  async replayWebhook(@Body() payload: { deadLetterId: string }): Promise<{ status: string }> {
    // Mock replay behavior
    console.log(`[EnterpriseWebhookController] Replaying DLQ ID: ${payload.deadLetterId}`);
    return { status: 'SUCCESS' };
  }
}
