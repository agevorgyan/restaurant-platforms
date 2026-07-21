import { ValueObject } from '@saas/core';

export interface TransitionMetadataProps {
  metadata: Map<string, string>;
}

export class TransitionMetadata extends ValueObject<TransitionMetadataProps> {
  private constructor(props: TransitionMetadataProps) {
    super(props);
  }

  public static create(metadataObject: Record<string, string> = {}): TransitionMetadata {
    const map = new Map<string, string>();

    for (const [key, value] of Object.entries(metadataObject)) {
      if (!key || key.trim() === '') {
        throw new Error('TransitionMetadata keys cannot be empty');
      }
      if (map.has(key)) {
        throw new Error(`Duplicate metadata key: ${key}`);
      }
      map.set(key, value);
    }

    return new TransitionMetadata({ metadata: map });
  }

  public get(key: string): string | undefined {
    return this.props.metadata.get(key);
  }

  public toMap(): Map<string, string> {
    return new Map(this.props.metadata);
  }
}
