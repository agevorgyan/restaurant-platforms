import { DomainPrimitive } from '@saas/domain';

export class LicenseNumber extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): LicenseNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('License number cannot be empty.');
    }
    return new LicenseNumber(value.trim());
  }
}
