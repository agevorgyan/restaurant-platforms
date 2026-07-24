import { Entity, Identifier } from '@saas/domain';

export class SkillId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): SkillId {
    return new SkillId(value);
  }
  public static generate(): SkillId {
    return new SkillId(crypto.randomUUID());
  }
}

export class Skill extends Entity<SkillId> {
  constructor(
    id: SkillId,
    public name: string,
    public level: string
  ) {
    super(id);
  }
}
