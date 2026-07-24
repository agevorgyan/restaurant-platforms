import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { 
  SubscriptionRegistry, 
  EventDispatcher,
  DeadLetterService,
  EventReplayService
} from '../../application/services';
import { 
  EventSubscription, 
  DeadLetterMessage,
  ConsumerHealth
} from '../../application/read-models';

@Controller('events')
export class EnterpriseEventBusController {
  constructor(
    private readonly subscriptionRegistry: SubscriptionRegistry,
    private readonly eventDispatcher: EventDispatcher,
    private readonly dlqService: DeadLetterService,
    private readonly replayService: EventReplayService
  ) {}

  @Get('subscriptions')
  async getSubscriptions(@Query('topic') topic?: string): Promise<EventSubscription[]> {
    if (topic) {
      return this.subscriptionRegistry.getSubscriptionsForTopic(topic);
    }
    return this.subscriptionRegistry.getSubscriptions();
  }

  @Get('health')
  async getConsumerHealth(@Query('subscriberId') subscriberId: string): Promise<ConsumerHealth> {
    return this.eventDispatcher.getConsumerHealth(subscriberId || 'default-consumer');
  }

  @Get('statistics')
  async getStatistics(): Promise<any> {
    return {
      status: 'OK',
      totalEventsPublished: 10000,
      totalEventsConsumed: 9950,
      totalDeadLetters: this.dlqService.getDeadLetters().length
    };
  }

  @Get('dlq')
  async getDeadLetters(): Promise<DeadLetterMessage[]> {
    return this.dlqService.getDeadLetters();
  }

  @Post('replay')
  async replayEvents(
    @Body() payload: { subscriptionId?: string }
  ): Promise<{ status: string; replayedCount: number }> {
    const replayedCount = await this.replayService.replayDeadLetters(payload.subscriptionId);
    return {
      status: 'SUCCESS',
      replayedCount
    };
  }
}
