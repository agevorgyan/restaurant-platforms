export class TransactionReference {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Transaction reference cannot be empty');
    }
  }
}

export class IdempotencyKey {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Idempotency key cannot be empty');
    }
  }
}

export class FailureReason {
  constructor(public readonly code: string, public readonly message: string) {
    if (!code || !message) {
      throw new Error('Failure reason must contain a code and message');
    }
  }
}

export type TransactionTypeEnum = 'Authorization' | 'Capture' | 'PartialCapture' | 'Void' | 'Refund' | 'PartialRefund' | 'Settlement';

export class TransactionType {
  constructor(public readonly value: TransactionTypeEnum) {
    const valid = ['Authorization', 'Capture', 'PartialCapture', 'Void', 'Refund', 'PartialRefund', 'Settlement'];
    if (!valid.includes(value)) {
      throw new Error(`Invalid Transaction Type: ${value}`);
    }
  }
}

export type TransactionStatusEnum = 'Pending' | 'Succeeded' | 'Failed' | 'Cancelled';

export class TransactionStatus {
  constructor(public readonly value: TransactionStatusEnum) {
    const valid = ['Pending', 'Succeeded', 'Failed', 'Cancelled'];
    if (!valid.includes(value)) {
      throw new Error(`Invalid Transaction Status: ${value}`);
    }
  }
}
