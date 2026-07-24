import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';

export class PayrollAdjustmentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollAdjustmentId { return new PayrollAdjustmentId(value); }
  public static generate(): PayrollAdjustmentId { return new PayrollAdjustmentId(crypto.randomUUID()); }
}

export class PayrollAdjustment extends Entity<PayrollAdjustmentId> {
  constructor(
    id: PayrollAdjustmentId,
    public readonly staffId: StaffId,
    public readonly reason: string,
    public readonly hourAdjustment: number,
    public readonly type: 'REGULAR' | 'OVERTIME' | 'NIGHT' | 'HOLIDAY'
  ) {
    super(id);
  }

  public static create(
    staffId: StaffId,
    reason: string,
    hourAdjustment: number,
    type: 'REGULAR' | 'OVERTIME' | 'NIGHT' | 'HOLIDAY'
  ): PayrollAdjustment {
    return new PayrollAdjustment(
      PayrollAdjustmentId.generate(),
      staffId,
      reason,
      hourAdjustment,
      type
    );
  }
}
