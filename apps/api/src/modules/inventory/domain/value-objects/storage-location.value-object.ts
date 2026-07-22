import { ValueObject } from '@saas/core';

export interface StorageLocationProps {
  value: string;
}

export class StorageLocation extends ValueObject<StorageLocationProps> {
  private constructor(props: StorageLocationProps) {
    super(props);
  }

  public static create(value: string): StorageLocation {
    if (!value || value.trim().length === 0) {
      throw new Error('Storage location cannot be empty');
    }
    return new StorageLocation({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
