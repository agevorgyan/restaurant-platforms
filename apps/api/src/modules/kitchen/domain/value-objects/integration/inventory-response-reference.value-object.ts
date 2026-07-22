import { ValueObject } from '@saas/core';

export interface InventoryResponseReferenceProps {
  correlationId: string;
  success: boolean;
  message?: string;
}

export class InventoryResponseReference extends ValueObject<InventoryResponseReferenceProps> {
  get correlationId(): string {
    return this.props.correlationId;
  }

  get success(): boolean {
    return this.props.success;
  }

  get message(): string | undefined {
    return this.props.message;
  }

  private constructor(props: InventoryResponseReferenceProps) {
    super(props);
  }

  public static create(correlationId: string, success: boolean, message?: string): InventoryResponseReference {
    if (!correlationId || correlationId.trim() === '') {
      throw new Error('Correlation ID cannot be empty');
    }
    return new InventoryResponseReference({
      correlationId: correlationId.trim(),
      success,
      message
    });
  }
}
