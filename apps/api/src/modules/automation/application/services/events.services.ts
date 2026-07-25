/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PublishEventDto, CreateSubscriptionDto, ReplayEventsDto } from '../dto/events.dto';

@Injectable()
export class EventPublisherService {
  async publishEvent(dto: PublishEventDto): Promise<void> {}

  async getEvents(): Promise<any[]> {
    return [];
  }

  async getStatistics(): Promise<any> {
    return {};
  }
}

@Injectable()
export class EventSubscriberService {
  async handleIncomingEvent(eventId: string, topic: string, payload: Record<string, any>): Promise<void> {}
}

@Injectable()
export class EventRouterService {
  async routeEvent(eventId: string, topic: string): Promise<void> {}
}

@Injectable()
export class EventReplayService {
  async replayEvents(dto: ReplayEventsDto): Promise<void> {}
}

@Injectable()
export class DeadLetterService {
  async getDeadLetterQueue(): Promise<any[]> {
    return [];
  }

  async moveToDeadLetter(eventId: string, topic: string, reasonCode: string, reasonMessage: string): Promise<void> {}
}

@Injectable()
export class RetryService {
  async scheduleRetry(eventId: string, attemptCount: number): Promise<void> {}
}

@Injectable()
export class CorrelationService {
  async trackCorrelation(eventId: string, correlationId: string, causationId?: string): Promise<void> {}
}

@Injectable()
export class SubscriptionService {
  async createSubscription(dto: CreateSubscriptionDto): Promise<any> {
    return {};
  }

  async getSubscriptions(): Promise<any[]> {
    return [];
  }
}
