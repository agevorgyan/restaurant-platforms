/**
 * Enterprise Integration Event Bridge - Domain Exceptions
 */

export class BridgeDomainException extends Error {
  constructor(message: string, public readonly code: string = 'BRIDGE_DOMAIN_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TranslationException extends BridgeDomainException {
  constructor(reason: string) {
    super(`External event translation failed: ${reason}`, 'EVENT_TRANSLATION_FAILED');
  }
}

export class RoutingException extends BridgeDomainException {
  constructor(reason: string) {
    super(`Bridge routing error: ${reason}`, 'EVENT_ROUTING_FAILED');
  }
}

export class DuplicateBridgeEventException extends BridgeDomainException {
  constructor(eventId: string) {
    super(`Duplicate external event '${eventId}' already processed`, 'DUPLICATE_EVENT_DETECTED');
  }
}

export class BridgeEventNotFoundException extends BridgeDomainException {
  constructor(eventId: string) {
    super(`Bridge event with ID '${eventId}' was not found`, 'BRIDGE_EVENT_NOT_FOUND');
  }
}
