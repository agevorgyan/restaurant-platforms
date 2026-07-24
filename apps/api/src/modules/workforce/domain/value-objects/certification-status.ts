import { DomainPrimitive } from '@saas/domain';

export enum CertificationStatusEnum {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED'
}

export class CertificationStatus extends DomainPrimitive<CertificationStatusEnum> {
  private constructor(value: CertificationStatusEnum) {
    super(value);
  }

  public static create(value: CertificationStatusEnum): CertificationStatus {
    if (!Object.values(CertificationStatusEnum).includes(value)) {
      throw new Error(`Invalid certification status: ${value}`);
    }
    return new CertificationStatus(value);
  }
}
