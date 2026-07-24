import {
  WebhookSubscription,
  WebhookDelivery,
  WebhookHealth,
  FailedWebhook
} from '../read-models';

export class SignatureValidationService {
  public generateSignature(payload: string, secret: string): string {
    // Mock HMAC SHA-256 generation
    return `sha256=${crypto.randomUUID()}`;
  }

  public validateSignature(payload: string, signature: string, secret: string): boolean {
    const expected = this.generateSignature(payload, secret);
    return expected === signature;
  }
}

export class WebhookRetryService {
  public calculateNextBackoff(attemptNumber: number): number {
    const baseMs = 1000;
    return baseMs * Math.pow(2, attemptNumber);
  }
}

export class DeliveryTrackingService {
  private deliveries: Map<string, WebhookDelivery> = new Map();

  public recordDelivery(delivery: WebhookDelivery): void {
    this.deliveries.set(delivery.deliveryId, delivery);
  }
}

export class DeadLetterWebhookService {
  private dlq: Map<string, FailedWebhook> = new Map();

  public moveToDlq(failed: FailedWebhook): void {
    this.dlq.set(failed.deadLetterId, failed);
    console.log(`[DeadLetterWebhookService] Webhook moved to DLQ: ${failed.deliveryId}`);
  }

  public getDeadLetters(): FailedWebhook[] {
    return Array.from(this.dlq.values());
  }
}

export class WebhookPublisher {
  constructor(private readonly signatureService: SignatureValidationService) {}

  public async publish(subscription: WebhookSubscription, eventId: string, payload: any): Promise<WebhookDelivery> {
    const signature = this.signatureService.generateSignature(JSON.stringify(payload), subscription.secretHash);
    
    // Mock HTTP POST to endpointUrl
    console.log(`[WebhookPublisher] HTTP POST ${subscription.endpointUrl} with signature ${signature}`);

    return {
      deliveryId: crypto.randomUUID(),
      subscriptionId: subscription.subscriptionId,
      eventId,
      payload,
      status: 'SUCCESS',
      completedAt: new Date()
    };
  }
}

export class WebhookReceiver {
  constructor(private readonly signatureService: SignatureValidationService) {}

  public async receive(payload: string, signature: string, secret: string): Promise<boolean> {
    return this.signatureService.validateSignature(payload, signature, secret);
  }
}

export class WebhookReplayService {
  constructor(private readonly publisher: WebhookPublisher) {}

  public async replay(failed: FailedWebhook, subscription: WebhookSubscription): Promise<boolean> {
    console.log(`[WebhookReplayService] Replaying delivery ${failed.deliveryId}`);
    const delivery = await this.publisher.publish(subscription, failed.finalAttempt.attemptId, failed.finalAttempt.responseBody);
    return delivery.status === 'SUCCESS';
  }
}
