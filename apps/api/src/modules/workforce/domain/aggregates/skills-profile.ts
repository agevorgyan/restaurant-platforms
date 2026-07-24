import { AggregateRoot, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';
import { Skill } from '../entities/skill';
import { Certification } from '../entities/certification';
import { SkillCode } from '../value-objects/skill-code';
import { SkillName } from '../value-objects/skill-name';
import { SkillLevel } from '../value-objects/skill-level';
import { CertificationCode } from '../value-objects/certification-code';
import { CertificationName } from '../value-objects/certification-name';
import { ValidityPeriod } from '../value-objects/validity-period';
import { LicenseNumber } from '../value-objects/license-number';
import { SkillsProfileCreated, SkillAdded, SkillRemoved, SkillLevelUpdated, CertificationRegistered, CertificationRenewed, CertificationExpired, CertificationArchived } from '../events/skills-profile-events';
import { CertificationStatusEnum } from '../value-objects/certification-status';

export class SkillsProfileId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SkillsProfileId { return new SkillsProfileId(value); }
  public static generate(): SkillsProfileId { return new SkillsProfileId(crypto.randomUUID()); }
}

export class SkillsProfile extends AggregateRoot<SkillsProfileId> {
  private _skills: Skill[] = [];
  private _certifications: Certification[] = [];

  constructor(
    id: SkillsProfileId,
    public readonly staffId: StaffId
  ) {
    super(id);
  }

  public static create(staffId: StaffId): SkillsProfile {
    const id = SkillsProfileId.generate();
    const profile = new SkillsProfile(id, staffId);

    profile.record(new SkillsProfileCreated(id.toValue(), profile.version(), {
      profileId: id.toValue(),
      staffId: staffId.toValue()
    }));

    return profile;
  }

  get skills(): Skill[] { return [...this._skills]; }
  get certifications(): Certification[] { return [...this._certifications]; }

  public addSkill(code: SkillCode, name: SkillName, level: SkillLevel): void {
    const exists = this._skills.some(s => s.code.toValue() === code.toValue());
    if (exists) {
      throw new Error('A skill cannot be duplicated.');
    }

    const skill = Skill.create(code, name, level);
    this._skills.push(skill);

    this.record(new SkillAdded(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      skillCode: code.toValue(),
      skillLevel: level.toValue()
    }));
  }

  public removeSkill(code: SkillCode): void {
    const initialLength = this._skills.length;
    this._skills = this._skills.filter(s => s.code.toValue() !== code.toValue());
    
    if (this._skills.length === initialLength) {
      throw new Error('Skill not found.');
    }

    this.record(new SkillRemoved(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      skillCode: code.toValue()
    }));
  }

  public updateSkillLevel(code: SkillCode, newLevel: SkillLevel): void {
    const skill = this._skills.find(s => s.code.toValue() === code.toValue());
    if (!skill) {
      throw new Error('Skill not found.');
    }

    skill.updateLevel(newLevel);

    this.record(new SkillLevelUpdated(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      skillCode: code.toValue(),
      newLevel: newLevel.toValue()
    }));
  }

  public registerCertification(code: CertificationCode, name: CertificationName, validity: ValidityPeriod, licenseNumber?: LicenseNumber): void {
    const exists = this._certifications.some(c => c.code.toValue() === code.toValue());
    if (exists) {
      throw new Error('Certification code must be unique within the profile.');
    }

    const certification = Certification.create(code, name, validity, licenseNumber);
    this._certifications.push(certification);

    this.record(new CertificationRegistered(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      certificationCode: code.toValue()
    }));
  }

  public renewCertification(code: CertificationCode, newValidity: ValidityPeriod): void {
    const cert = this._certifications.find(c => c.code.toValue() === code.toValue());
    if (!cert) {
      throw new Error('Certification not found.');
    }

    cert.renew(newValidity);

    this.record(new CertificationRenewed(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      certificationCode: code.toValue(),
      expirationDate: newValidity.toValue().expirationDate
    }));
  }

  public expireCertification(code: CertificationCode): void {
    const cert = this._certifications.find(c => c.code.toValue() === code.toValue());
    if (!cert) {
      throw new Error('Certification not found.');
    }

    cert.expire();

    this.record(new CertificationExpired(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      certificationCode: code.toValue()
    }));
  }

  public archiveCertification(code: CertificationCode): void {
    const cert = this._certifications.find(c => c.code.toValue() === code.toValue());
    if (!cert) {
      throw new Error('Certification not found.');
    }

    cert.archive();

    this.record(new CertificationArchived(this.id.toValue(), this.version(), {
      profileId: this.id.toValue(),
      certificationCode: code.toValue()
    }));
  }
}
