import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  ConversationDeliveryService,
  ProviderRegistry,
  DeliveryTrackingService,
  ProviderHealthService,
  WebhookReceiver
} from '../../application/services';
import { 
  OutgoingMessage,
  ProviderHealth,
  IncomingWebhook
} from '../../application/read-models';

@Controller('notifications/conversations')
export class EnterpriseConversationsController {
  constructor(
    private readonly deliveryService: ConversationDeliveryService,
    private readonly registry: ProviderRegistry,
    private readonly tracking: DeliveryTrackingService,
    private readonly healthService: ProviderHealthService,
    private readonly webhookReceiver: WebhookReceiver
  ) {}

  @Get()
  async getConversations(): Promise<OutgoingMessage[]> {
    return [];
  }

  @Get('providers')
  async getProviders(): Promise<string[]> {
    return this.registry.getAllProviders();
  }

  @Get('statistics')
  async getStatistics(): Promise<any> {
    return this.tracking.getStatistics();
  }

  @Get('health')
  async getHealth(@Param('providerName') providerName: string): Promise<ProviderHealth> {
    return this.healthService.getHealth(providerName || 'WHATSAPP_CLOUD');
  }

  @Post('test')
  async sendTestMessage(
    @Body() payload: Omit<OutgoingMessage, 'messageId' | 'status' | 'createdAt' | 'tenantId'>
  ): Promise<OutgoingMessage> {
    const message: OutgoingMessage = {
      ...payload,
      messageId: crypto.randomUUID(),
      tenantId: 'global',
      status: 'QUEUED',
      createdAt: new Date()
    };
    return this.deliveryService.dispatchMessage(message);
  }

  @Post('webhook/:provider')
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() payload: any
  ): Promise<{ status: string }> {
    const webhook: IncomingWebhook = {
      webhookId: crypto.randomUUID(),
      providerName: provider.toUpperCase() as any,
      eventType: payload.eventType || 'INBOUND_MESSAGE',
      payload,
      receivedAt: new Date(),
      status: 'PENDING'
    };
    
    await this.webhookReceiver.handleIncomingWebhook(webhook);
    return { status: 'RECEIVED' };
  }
}
