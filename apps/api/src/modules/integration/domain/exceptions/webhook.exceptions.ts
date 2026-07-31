/**
 * Enterprise Webhook Platform - Domain Exceptions
 */

export class WebhookDomainException extends Error {
  constructor(message: string, public readonly code: string = 'WEBHOOK_DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidSignatureException extends WebhookDomainException {
  constructor(reason: string = 'Signature verification failed') {
    super(`Webhook signature validation failed: ${reason}`, 'INVALID_SIGNATURE');
  }
}

export class ReplayAttackException extends WebhookDomainException {
  constructor(reason: string) {
    super(`Replay attack prevented: ${reason}`, 'REPLAY_ATTACK_DETECTED');
  }
}

export class DeadLetterQueueException extends WebhookDomainException {
  constructor(message: string) {
    super(message, 'DEAD_LETTER_QUEUE_ERROR');
  }
}

export class WebhookRejectedException extends WebhookDomainException {
  constructor(reason: string) {
    super(`Webhook rejected: ${reason}`, 'WEBHOOK_REJECTED');
  }
}
