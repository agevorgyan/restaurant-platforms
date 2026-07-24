import { DomainPrimitive } from '@saas/domain';

export class CertificationName extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): CertificationName {
    if (!value || value.trim().length === 0) {
      throw new Error('Certification name cannot be empty.');
    }
    return new CertificationName(value.trim());
  }
}
