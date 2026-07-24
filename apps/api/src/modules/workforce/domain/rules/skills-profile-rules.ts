import { Specification } from '@saas/domain-rules';
import { Certification } from '../entities/certification';
import { SkillLevelEnum } from '../value-objects/skill-level';

export class CertificationValiditySpecification extends Specification<Certification> {
  public isSatisfiedBy(candidate: Certification): boolean {
    return candidate.status.toValue() === 'VALID' && !candidate.validity.isExpired(new Date());
  }
}

export class SkillLevelSpecification extends Specification<string> {
  public isSatisfiedBy(candidate: string): boolean {
    return Object.values(SkillLevelEnum).includes(candidate as SkillLevelEnum);
  }
}

export interface QualificationContext {
  requiredSkills: string[];
  requiredCertifications: string[];
  possessedSkills: string[];
  possessedCertifications: string[];
}

export class QualificationSpecification extends Specification<QualificationContext> {
  public isSatisfiedBy(candidate: QualificationContext): boolean {
    const hasSkills = candidate.requiredSkills.every(s => candidate.possessedSkills.includes(s));
    const hasCerts = candidate.requiredCertifications.every(c => candidate.possessedCertifications.includes(c));
    return hasSkills && hasCerts;
  }
}

export class CertificationExpirationSpecification extends Specification<Certification> {
  public isSatisfiedBy(candidate: Certification): boolean {
    return candidate.validity.isExpired(new Date());
  }
}
