import { MenuCorrelationId } from '../value-objects/menu-correlation-id.value-object';
import { MenuCausationId } from '../value-objects/menu-causation-id.value-object';

export class MenuCorrelationManager {
  public extract(metadata: any): { correlationId: MenuCorrelationId, causationId: MenuCausationId } {
    return {
      correlationId: MenuCorrelationId.create(metadata.correlationId),
      causationId: MenuCausationId.create(metadata.causationId || metadata.correlationId)
    };
  }
}