import { DomainPrimitive } from '@saas/domain';

export class PhoneNumber extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): PhoneNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('Phone number cannot be empty.');
    }
    return new PhoneNumber(value);
  }
}
