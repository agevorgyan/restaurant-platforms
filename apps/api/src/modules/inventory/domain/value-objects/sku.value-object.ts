import { ValueObject } from '@saas/core';

export interface SKUProps {
  value: string;
}

export class SKU extends ValueObject<SKUProps> {
  private constructor(props: SKUProps) {
    super(props);
  }

  public static create(value: string): SKU {
    if (!value || value.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }
    const cleanValue = value.trim().toUpperCase();
    if (cleanValue.length < 3 || cleanValue.length > 30) {
      throw new Error('SKU must be between 3 and 30 characters');
    }
    if (!/^[A-Z0-9-]+$/.test(cleanValue)) {
      throw new Error('SKU can only contain uppercase letters, numbers, and hyphens');
    }

    return new SKU({ value: cleanValue });
  }

  get value(): string {
    return this.props.value;
  }
}
