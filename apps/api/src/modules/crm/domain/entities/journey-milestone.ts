import { Entity, Identifier } from '@saas/domain';

export class JourneyMilestoneId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JourneyMilestoneId { return new JourneyMilestoneId(value); }
  public static generate(): JourneyMilestoneId { return new JourneyMilestoneId(crypto.randomUUID()); }
}

export class JourneyMilestone extends Entity<JourneyMilestoneId> {
  constructor(
    id: JourneyMilestoneId,
    public readonly name: string,
    public readonly sequence: number,
    public isCompleted: boolean,
    public completedAt?: Date,
    public completedBy?: string,
    public notes?: string
  ) {
    super(id);
  }

  public static create(name: string, sequence: number): JourneyMilestone {
    return new JourneyMilestone(JourneyMilestoneId.generate(), name, sequence, false);
  }

  public complete(completedBy: string, notes?: string): void {
    this.isCompleted = true;
    this.completedAt = new Date();
    this.completedBy = completedBy;
    if (notes) this.notes = notes;
  }
}
