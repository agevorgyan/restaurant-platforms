import { InventoryAcknowledgementSpecification } from '../../specifications/integration.specifications';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { InventoryAcknowledgementReceivedEvent } from '../../events/integration.events';

export class InventoryAcknowledgementHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleAcknowledgement(ackPayload: any, correlationId: string): void {
    if (InventoryAcknowledgementSpecification.isSatisfiedBy(ackPayload)) {
      // Record acknowledgement
      // e.g. DomainEventPublisher.publish(new InventoryAcknowledgementReceivedEvent(...))
    } else {
      throw new Error('Invalid acknowledgement payload');
    }
  }
}