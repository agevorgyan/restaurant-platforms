import { ValueObject } from '@saas/core';

export interface InventoryRequestReferenceProps {
  correlationId: string;
  sourceContext: string;
}

export class InventoryRequestReference extends ValueObject<InventoryRequestReferenceProps> {
  get correlationId(): string {
    return this.props.correlationId;
  }

  get sourceContext(): string {
    return this.props.sourceContext;
  }

  private constructor(props: InventoryRequestReferenceProps) {
    super(props);
  }

  public static create(correlationId: string, sourceContext: string = 'KITCHEN'): InventoryRequestReference {
    if (!correlationId || correlationId.trim() === '') {
      throw new Error('Correlation ID cannot be empty');
    }
    return new InventoryRequestReference({
      correlationId: correlationId.trim(),
      sourceContext
    });
  }
}
