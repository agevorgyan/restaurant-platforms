import { 
  EventEnvelope, 
  EventSubscription, 
  DeadLetterMessage,
  ConsumerHealth
} from '../read-models';

export class SchemaRegistryService {
  public validateEventPayload(topic: string, payload: any): boolean {
    // Mock schema registry validation
    return !!payload;
  }
}

export class SubscriptionRegistry {
  private subscriptions: Map<string, EventSubscription> = new Map();

  public registerSubscription(sub: EventSubscription): void {
    this.subscriptions.set(sub.subscriptionId, sub);
  }

  public getSubscriptions(): EventSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  public getSubscriptionsForTopic(topic: string): EventSubscription[] {
    return this.getSubscriptions().filter(s => s.isActive && (s.topicPattern === topic || s.topicPattern === '*'));
  }
}

export class EventPublisher {
  constructor(private readonly schemaRegistry: SchemaRegistryService) {}

  public async publish(envelope: EventEnvelope): Promise<void> {
    if (!this.schemaRegistry.validateEventPayload(envelope.eventName, envelope.payload)) {
      throw new Error(`Payload failed schema validation for event: ${envelope.eventName}`);
    }
    // Mock publishing to message broker (Kafka, RabbitMQ, etc.)
    console.log(`[EventPublisher] Event published: ${envelope.eventId} to ${envelope.eventName}`);
  }
}

export class RetryService {
  public scheduleRetry(deliveryId: string, attemptCount: number): void {
    // Implement exponential backoff schedule
    console.log(`[RetryService] Scheduled retry for delivery: ${deliveryId}, attempt: ${attemptCount}`);
  }
}

export class DeadLetterService {
  private dlq: Map<string, DeadLetterMessage> = new Map();

  public moveToDlq(message: DeadLetterMessage): void {
    this.dlq.set(message.deadLetterId, message);
    console.log(`[DeadLetterService] Message moved to DLQ: ${message.eventId}`);
  }

  public getDeadLetters(): DeadLetterMessage[] {
    return Array.from(this.dlq.values());
  }
}

export class EventReplayService {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly dlqService: DeadLetterService
  ) {}

  public async replayDeadLetters(subscriptionId?: string): Promise<number> {
    let dlqs = this.dlqService.getDeadLetters();
    if (subscriptionId) {
      dlqs = dlqs.filter(m => m.subscriptionId === subscriptionId);
    }
    
    let replayed = 0;
    for (const msg of dlqs) {
      await this.publisher.publish(msg.envelope);
      replayed++;
    }
    return replayed;
  }
}

export class EventDispatcher {
  public dispatchToConsumer(subscription: EventSubscription, envelope: EventEnvelope): void {
    // Mock pushing to consumer queue
    console.log(`[EventDispatcher] Dispatched event ${envelope.eventId} to subscription ${subscription.subscriptionId}`);
  }

  public getConsumerHealth(subscriberId: string): ConsumerHealth {
    return {
      subscriberId,
      status: 'HEALTHY',
      queueDepth: 0,
      processingRatePerSecond: 100,
      lastHeartbeatAt: new Date()
    };
  }
}
