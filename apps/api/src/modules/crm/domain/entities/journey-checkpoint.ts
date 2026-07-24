import { Entity, Identifier } from '@saas/domain';

export class JourneyCheckpointId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JourneyCheckpointId { return new JourneyCheckpointId(value); }
  public static generate(): JourneyCheckpointId { return new JourneyCheckpointId(crypto.randomUUID()); }
}

export class JourneyCheckpoint extends Entity<JourneyCheckpointId> {
  constructor(
    id: JourneyCheckpointId,
    public readonly checkpointName: string,
    public readonly dateReached: Date,
    public readonly scoreAdjustment: number
  ) {
    super(id);
  }

  public static create(checkpointName: string, scoreAdjustment: number): JourneyCheckpoint {
    return new JourneyCheckpoint(JourneyCheckpointId.generate(), checkpointName, new Date(), scoreAdjustment);
  }
}
