import { Entity, Identifier } from '@saas/domain';

export class JourneyGoalId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JourneyGoalId { return new JourneyGoalId(value); }
  public static generate(): JourneyGoalId { return new JourneyGoalId(crypto.randomUUID()); }
}

export class JourneyGoal extends Entity<JourneyGoalId> {
  constructor(
    id: JourneyGoalId,
    public readonly description: string,
    public readonly targetDate: Date,
    public isAchieved: boolean,
    public achievedAt?: Date
  ) {
    super(id);
  }

  public static create(description: string, targetDate: Date): JourneyGoal {
    return new JourneyGoal(JourneyGoalId.generate(), description, targetDate, false);
  }

  public markAchieved(): void {
    this.isAchieved = true;
    this.achievedAt = new Date();
  }
}
