import { ValueObject } from '@saas/core';

export interface ManufacturingDateProps {
  value: Date;
}

export class ManufacturingDate extends ValueObject<ManufacturingDateProps> {
  private constructor(props: ManufacturingDateProps) {
    super(props);
  }

  public static create(value: Date): ManufacturingDate {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('Manufacturing date must be a valid date');
    }
    // Prevent future manufacturing dates
    if (value > new Date()) {
      throw new Error('Manufacturing date cannot be in the future');
    }
    return new ManufacturingDate({ value: new Date(value.getTime()) }); // Clone to ensure immutability
  }

  get value(): Date {
    return new Date(this.props.value.getTime());
  }
}
