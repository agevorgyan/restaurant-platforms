import { ValueObject } from '@saas/core';

export interface BarcodeProps {
  value: string;
}

export class Barcode extends ValueObject<BarcodeProps> {
  private constructor(props: BarcodeProps) {
    super(props);
  }

  public static create(value: string): Barcode {
    if (!value || value.trim().length === 0) {
      throw new Error('Barcode cannot be empty');
    }
    const cleanValue = value.trim();
    if (!/^[A-Za-z0-9]+$/.test(cleanValue)) {
      throw new Error('Barcode must be alphanumeric');
    }
    
    // Most barcodes (EAN-13, UPC, Code 39) are between 8 and 14 chars, but some can be up to 128
    if (cleanValue.length < 4 || cleanValue.length > 128) {
      throw new Error('Barcode length is out of acceptable bounds');
    }

    return new Barcode({ value: cleanValue });
  }

  get value(): string {
    return this.props.value;
  }
}
