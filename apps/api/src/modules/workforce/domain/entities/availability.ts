import { Entity, Identifier } from '@saas/domain';

export class AvailabilityId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }
  public static create(value: string): AvailabilityId {
    return new AvailabilityId(value);
  }
  public static generate(): AvailabilityId {
    return new AvailabilityId(crypto.randomUUID());
  }
}

export class Availability extends Entity<AvailabilityId> {
  constructor(
    id: AvailabilityId,
    public dayOfWeek: number,
    public startTime: string,
    public endTime: string
  ) {
    super(id);
  }
}
