import { ContractMetadata } from '../contracts/inbound.contracts';
import { MenuCorrelationId } from '../value-objects/menu-correlation-id.value-object';
import { MenuCausationId } from '../value-objects/menu-causation-id.value-object';

export class MenuEventFactory {
  public static createOutboundMetadata(correlationId?: string): ContractMetadata {
    const id = MenuCorrelationId.create(correlationId).value;
    return {
      correlationId: id,
      causationId: MenuCausationId.create(id).value,
      eventVersion: '1.0.0',
      schemaVersion: '1.0.0',
      producer: 'MENU',
      timestamp: new Date().toISOString()
    };
  }
}