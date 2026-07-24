import { DomainPrimitive } from '@saas/domain';

export interface ValidityPeriodProps {
  issueDate: Date;
  expirationDate?: Date; // Optional: Some certs never expire
}

export class ValidityPeriod extends DomainPrimitive<ValidityPeriodProps> {
  private constructor(value: ValidityPeriodProps) {
    super(value);
  }

  public static create(issueDate: Date, expirationDate?: Date): ValidityPeriod {
    if (expirationDate && issueDate >= expirationDate) {
      throw new Error('Expiration date must be after issue date.');
    }
    return new ValidityPeriod({ issueDate, expirationDate });
  }

  public isExpired(currentDate: Date = new Date()): boolean {
    if (!this.value.expirationDate) {
      return false; // Does not expire
    }
    return currentDate > this.value.expirationDate;
  }
}
