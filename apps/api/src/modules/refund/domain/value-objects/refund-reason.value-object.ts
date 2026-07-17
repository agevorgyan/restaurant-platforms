export type RefundReasonEnum = 'CustomerRequest' | 'OrderCancelled' | 'DuplicatePayment' | 'Fraud' | 'SystemError' | 'ProductUnavailable' | 'Other';

export class RefundReason {
  constructor(public readonly value: RefundReasonEnum, public readonly details?: string) {
    const valid = ['CustomerRequest', 'OrderCancelled', 'DuplicatePayment', 'Fraud', 'SystemError', 'ProductUnavailable', 'Other'];
    if (!valid.includes(value)) {
      throw new Error(`Invalid Refund Reason: ${value}`);
    }
  }
}
