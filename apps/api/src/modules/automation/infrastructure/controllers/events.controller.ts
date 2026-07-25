/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  EventPublisherService,
  SubscriptionService,
  DeadLetterService,
  EventReplayService,
} from '../../application/services';
import {
  PublishEventDto,
  CreateSubscriptionDto,
  ReplayEventsDto,
} from '../../application/dto';

@Controller('automation')
export class EventsController {
  constructor(
    private readonly publisherService: EventPublisherService,
    private readonly subscriptionService: SubscriptionService,
    private readonly deadLetterService: DeadLetterService,
    private readonly replayService: EventReplayService,
  ) {}

  @Get('events')
  async getEvents() {
    return this.publisherService.getEvents();
  }

  @Post('events/publish')
  async publishEvent(@Body() dto: PublishEventDto) {
    return this.publisherService.publishEvent(dto);
  }

  @Get('subscriptions')
  async getSubscriptions() {
    return this.subscriptionService.getSubscriptions();
  }

  @Post('subscriptions')
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(dto);
  }

  @Get('events/dead-letter')
  async getDeadLetterQueue() {
    return this.deadLetterService.getDeadLetterQueue();
  }

  @Post('events/replay')
  async replayEvents(@Body() dto: ReplayEventsDto) {
    return this.replayService.replayEvents(dto);
  }

  @Get('events/statistics')
  async getStatistics() {
    return this.publisherService.getStatistics();
  }
}
