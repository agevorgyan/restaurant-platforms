import { Entity, Identifier } from '@saas/domain';
import { CertificationCode } from '../value-objects/certification-code';
import { CertificationName } from '../value-objects/certification-name';
import { CertificationStatus, CertificationStatusEnum } from '../value-objects/certification-status';
import { ValidityPeriod } from '../value-objects/validity-period';
import { LicenseNumber } from '../value-objects/license-number';

export class CertificationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CertificationId { return new CertificationId(value); }
  public static generate(): CertificationId { return new CertificationId(crypto.randomUUID()); }
}

export class Certification extends Entity<CertificationId> {
  private _status: CertificationStatus;
  private _validity: ValidityPeriod;

  constructor(
    id: CertificationId,
    public readonly code: CertificationCode,
    public readonly name: CertificationName,
    public readonly licenseNumber: LicenseNumber | undefined,
    validity: ValidityPeriod,
    status: CertificationStatus = CertificationStatus.create(CertificationStatusEnum.VALID)
  ) {
    super(id);
    this._validity = validity;
    this._status = status;
  }

  public static create(
    code: CertificationCode, 
    name: CertificationName, 
    validity: ValidityPeriod, 
    licenseNumber?: LicenseNumber
  ): Certification {
    return new Certification(
      CertificationId.generate(),
      code,
      name,
      licenseNumber,
      validity,
      CertificationStatus.create(CertificationStatusEnum.VALID)
    );
  }

  get status(): CertificationStatus {
    return this._status;
  }

  get validity(): ValidityPeriod {
    return this._validity;
  }

  public renew(newValidity: ValidityPeriod): void {
    if (this._status.toValue() === CertificationStatusEnum.ARCHIVED) {
      throw new Error('Cannot renew an archived certification.');
    }
    // Business Rule: Renewal issue date must be after previous issue date.
    if (newValidity.toValue().issueDate <= this._validity.toValue().issueDate) {
      throw new Error('Renewal must occur after the issue date.');
    }
    this._validity = newValidity;
    this._status = CertificationStatus.create(CertificationStatusEnum.VALID);
  }

  public expire(): void {
    if (this._status.toValue() === CertificationStatusEnum.ARCHIVED) {
      throw new Error('Cannot expire an archived certification.');
    }
    this._status = CertificationStatus.create(CertificationStatusEnum.EXPIRED);
  }

  public archive(): void {
    this._status = CertificationStatus.create(CertificationStatusEnum.ARCHIVED);
  }

  public equals(other: Certification): boolean {
    return this.code.toValue() === other.code.toValue();
  }
}
