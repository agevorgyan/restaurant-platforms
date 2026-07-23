import { PoisonMessagePolicy } from '../policies/menu-acl.policies';
import { PoisonMessageDetectedEvent } from '../events/menu-acl.events';

export class PoisonMessageHandler {
  public handle(payload: any, correlationId: string): PoisonMessageDetectedEvent {
    PoisonMessagePolicy.handle(payload);
    const preview = JSON.stringify(payload).substring(0, 100);
    return new PoisonMessageDetectedEvent(correlationId, preview);
  }
}