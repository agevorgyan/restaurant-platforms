import { DomainPrimitive } from '@saas/domain';

export enum SkillLevelEnum {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export class SkillLevel extends DomainPrimitive<SkillLevelEnum> {
  private constructor(value: SkillLevelEnum) {
    super(value);
  }

  public static create(value: SkillLevelEnum): SkillLevel {
    if (!Object.values(SkillLevelEnum).includes(value)) {
      throw new Error(`Invalid skill level: ${value}`);
    }
    return new SkillLevel(value);
  }
}
