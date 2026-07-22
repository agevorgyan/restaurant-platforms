import { ValueObject } from '@saas/core';

export interface ExpirationDateProps {
  value: Date | null;
}

export class ExpirationDate extends ValueObject<ExpirationDateProps> {
  private constructor(props: ExpirationDateProps) {
    super(props);
  }

  public static create(value: Date | null): ExpirationDate {
    if (value !== null && (!(value instanceof Date) || isNaN(value.getTime()))) {
      throw new Error('Expiration date must be a valid date or null');
    }
    const safeValue = value ? new Date(value.getTime()) : null;
    return new ExpirationDate({ value: safeValue });
  }

  public isExpired(currentDate: Date = new Date()): boolean {
    if (this.props.value === null) {
      return false; // Does not expire
    }
    return this.props.value <= currentDate;
  }

  public getRemainingDays(currentDate: Date = new Date()): number | null {
    if (this.props.value === null) {
      return null;
    }
    const diffTime = this.props.value.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get value(): Date | null {
    return this.props.value ? new Date(this.props.value.getTime()) : null;
  }
}
