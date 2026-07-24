import { DomainPrimitive } from '@saas/domain';

export class LeaveReason extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): LeaveReason {
    if (!value || value.trim().length === 0) {
      throw new Error('Leave reason cannot be empty.');
    }
    return new LeaveReason(value);
  }
}
