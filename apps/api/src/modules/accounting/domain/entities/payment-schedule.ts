import { Entity, Identifier } from '@saas/domain';

export class PaymentScheduleId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PaymentScheduleId { return new PaymentScheduleId(value); }
  public static generate(): PaymentScheduleId { return new PaymentScheduleId(crypto.randomUUID()); }
}

export class PaymentSchedule extends Entity<PaymentScheduleId> {
  constructor(
    id: PaymentScheduleId,
    public readonly scheduledAmount: number,
    public readonly scheduledDate: Date,
    public readonly status: string
  ) {
    super(id);
    if (scheduledAmount <= 0) throw new Error('Scheduled amount must be strictly positive.');
  }

  public static create(scheduledAmount: number, scheduledDate: Date): PaymentSchedule {
    return new PaymentSchedule(PaymentScheduleId.generate(), scheduledAmount, scheduledDate, 'PENDING');
  }
}
