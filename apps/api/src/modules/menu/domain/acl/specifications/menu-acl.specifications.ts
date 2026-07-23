import { MenuCorrelationId } from '../value-objects/menu-correlation-id.value-object';
import { MenuCausationId } from '../value-objects/menu-causation-id.value-object';

export class MenuIntegrationSpecification {
  public static isSatisfiedBy(metadata: any): boolean {
    return !!metadata && !!metadata.correlationId && !!metadata.timestamp;
  }
}

export class ContractCompatibilitySpecification {
  public static isSatisfiedBy(schema: string, supportedSchemas: string[]): boolean {
    return supportedSchemas.includes(schema);
  }
}

export class EventVersionSpecification {
  public static isSatisfiedBy(eventVersion: string, currentSystemVersion: string): boolean {
    const evMajor = eventVersion.split('.')[0];
    const sysMajor = currentSystemVersion.split('.')[0];
    return evMajor === sysMajor;
  }
}

export class CorrelationSpecification {
  public static isSatisfiedBy(correlationId: MenuCorrelationId, causationId: MenuCausationId): boolean {
    return !!correlationId.value && !!causationId.value;
  }
}

export class IdempotencySpecification {
  public static isSatisfiedBy(eventId: string, isProcessed: boolean): boolean {
    return !isProcessed;
  }
}