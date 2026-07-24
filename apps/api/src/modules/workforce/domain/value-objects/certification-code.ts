import { DomainPrimitive } from '@saas/domain';

export class CertificationCode extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): CertificationCode {
    if (!value || value.trim().length === 0) {
      throw new Error('Certification code cannot be empty.');
    }
    return new CertificationCode(value.trim().toUpperCase());
  }
}
