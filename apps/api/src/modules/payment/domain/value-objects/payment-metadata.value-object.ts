import { ValueObject } from '@saas/core';

export interface PaymentMetadataProps {
  metadata: Map<string, string>;
}

export class PaymentMetadata extends ValueObject<PaymentMetadataProps> {
  private constructor(props: PaymentMetadataProps) {
    super(props);
  }

  public static create(metadataObject: Record<string, string> = {}): PaymentMetadata {
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

    return new PaymentMetadata({ metadata: map });
  }

  public get(key: string): string | undefined {
    return this.props.metadata.get(key);
  }

  public toMap(): Map<string, string> {
    return new Map(this.props.metadata);
  }
}
