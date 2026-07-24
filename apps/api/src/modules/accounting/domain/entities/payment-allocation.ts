import { Entity, Identifier } from '@saas/domain';

export class PaymentAllocationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PaymentAllocationId { return new PaymentAllocationId(value); }
  public static generate(): PaymentAllocationId { return new PaymentAllocationId(crypto.randomUUID()); }
}

export class PaymentAllocation extends Entity<PaymentAllocationId> {
  constructor(
    id: PaymentAllocationId,
    public readonly paymentReference: string,
    public readonly allocatedAmount: number,
    public readonly allocationDate: Date,
    public readonly notes: string
  ) {
    super(id);
    if (allocatedAmount <= 0) throw new Error('Allocated amount must be strictly positive.');
  }

  public static create(paymentReference: string, allocatedAmount: number, notes: string = ''): PaymentAllocation {
    return new PaymentAllocation(PaymentAllocationId.generate(), paymentReference, allocatedAmount, new Date(), notes);
  }
}
