import { DomainPrimitive } from '@saas/domain';

export class SkillCode extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): SkillCode {
    if (!value || value.trim().length === 0) {
      throw new Error('Skill code cannot be empty.');
    }
    return new SkillCode(value.trim().toUpperCase());
  }
}
