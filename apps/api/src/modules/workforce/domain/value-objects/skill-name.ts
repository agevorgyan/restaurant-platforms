import { DomainPrimitive } from '@saas/domain';

export class SkillName extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): SkillName {
    if (!value || value.trim().length === 0) {
      throw new Error('Skill name cannot be empty.');
    }
    return new SkillName(value.trim());
  }
}
