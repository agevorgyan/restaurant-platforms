import { IDomainService } from '@saas/domain';
import { Skill } from '../entities/skill';
import { Certification } from '../entities/certification';

export class SkillValidationService implements IDomainService {
  public isSkillUnique(skills: Skill[], newSkillCode: string): boolean {
    return !skills.some(s => s.code.toValue() === newSkillCode);
  }
}

export class CertificationValidationService implements IDomainService {
  public isCertificationUnique(certifications: Certification[], newCertCode: string): boolean {
    return !certifications.some(c => c.code.toValue() === newCertCode);
  }
}

export class QualificationEvaluationService implements IDomainService {
  public meetsQualifications(skills: Skill[], certifications: Certification[], requiredSkills: string[], requiredCerts: string[]): boolean {
    const validCerts = certifications.filter(c => c.status.toValue() === 'VALID' && !c.validity.isExpired());
    
    const hasAllSkills = requiredSkills.every(req => skills.some(s => s.code.toValue() === req));
    const hasAllCerts = requiredCerts.every(req => validCerts.some(c => c.code.toValue() === req));

    return hasAllSkills && hasAllCerts;
  }
}

export class ComplianceEvaluationService implements IDomainService {
  public evaluateCompliance(certifications: Certification[]): { compliant: boolean, expiringSoon: Certification[] } {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const activeCerts = certifications.filter(c => c.status.toValue() !== 'ARCHIVED');
    
    const compliant = activeCerts.every(c => c.status.toValue() === 'VALID' && !c.validity.isExpired(now));
    
    const expiringSoon = activeCerts.filter(c => 
      c.status.toValue() === 'VALID' && 
      !c.validity.isExpired(now) && 
      c.validity.isExpired(thirtyDaysFromNow)
    );

    return { compliant, expiringSoon };
  }
}
