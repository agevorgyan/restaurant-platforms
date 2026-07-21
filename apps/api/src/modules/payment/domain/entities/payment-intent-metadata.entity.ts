import { Entity } from '@saas/core';

export interface PaymentIntentMetadataProps {
  metadata: Map<string, string>;
}

export class PaymentIntentMetadata extends Entity<PaymentIntentMetadataProps> {
  private constructor(props: PaymentIntentMetadataProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(metadataObject: Record<string, string> = {}, id?: string): PaymentIntentMetadata {
    const map = new Map<string, string>();

    for (const [key, value] of Object.entries(metadataObject)) {
      if (!key || key.trim() === '') {
        throw new Error('Metadata keys cannot be empty');
      }
      if (map.has(key)) {
        throw new Error(`Duplicate metadata key: ${key}`);
      }
      map.set(key, value);
    }

    return new PaymentIntentMetadata({ metadata: map }, id);
  }

  public get(key: string): string | undefined {
    return this.props.metadata.get(key);
  }

  public toMap(): Map<string, string> {
    return new Map(this.props.metadata);
  }
}
