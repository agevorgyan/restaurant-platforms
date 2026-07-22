import { ValueObject } from '@saas/core';

export interface InventoryReferenceProps {
  externalId: string;
  source: string;
}

export class InventoryReference extends ValueObject<InventoryReferenceProps> {
  get externalId(): string {
    return this.props.externalId;
  }

  get source(): string {
    return this.props.source;
  }

  private constructor(props: InventoryReferenceProps) {
    super(props);
  }

  public static create(externalId: string, source: string): InventoryReference {
    if (!externalId || externalId.trim().length === 0) {
      throw new Error('External ID cannot be empty');
    }
    
    if (!source || source.trim().length === 0) {
      throw new Error('Source cannot be empty');
    }

    return new InventoryReference({ 
      externalId: externalId.trim(),
      source: source.trim()
    });
  }
}
