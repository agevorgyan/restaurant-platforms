import { Entity, Identifier } from '@saas/domain';
import { SkillCode } from '../value-objects/skill-code';
import { SkillName } from '../value-objects/skill-name';
import { SkillLevel, SkillLevelEnum } from '../value-objects/skill-level';

export class SkillId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SkillId { return new SkillId(value); }
  public static generate(): SkillId { return new SkillId(crypto.randomUUID()); }
}

export class Skill extends Entity<SkillId> {
  private _level: SkillLevel;

  constructor(
    id: SkillId,
    public readonly code: SkillCode,
    public readonly name: SkillName,
    level: SkillLevel = SkillLevel.create(SkillLevelEnum.BEGINNER),
    public readonly acquiredAt: Date
  ) {
    super(id);
    this._level = level;
  }

  public static create(code: SkillCode, name: SkillName, level: SkillLevel): Skill {
    return new Skill(SkillId.generate(), code, name, level, new Date());
  }

  get level(): SkillLevel {
    return this._level;
  }

  public updateLevel(newLevel: SkillLevel): void {
    this._level = newLevel;
  }

  public equals(other: Skill): boolean {
    return this.code.toValue() === other.code.toValue();
  }
}
