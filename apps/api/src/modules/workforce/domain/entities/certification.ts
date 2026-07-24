import { Entity, Identifier } from '@saas/domain';

export class CertificationId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): CertificationId {
    return new CertificationId(value);
  }
  public static generate(): CertificationId {
    return new CertificationId(crypto.randomUUID());
  }
}

export class Certification extends Entity<CertificationId> {
  constructor(
    id: CertificationId,
    public name: string,
    public issuingBody: string,
    public issueDate: Date,
    public expiryDate: Date | null
  ) {
    super(id);
  }
}
