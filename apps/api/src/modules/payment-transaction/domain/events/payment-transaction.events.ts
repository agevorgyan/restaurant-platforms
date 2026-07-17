import { IPaymentTransaction } from '../entities/payment-transaction.interface';

export class PaymentTransactionCreatedEvent {
  constructor(public readonly transaction: IPaymentTransaction) {}
}

export class PaymentTransactionAuthorizedEvent {
  constructor(public readonly transaction: IPaymentTransaction) {}
}

export class PaymentTransactionCapturedEvent {
  constructor(public readonly transaction: IPaymentTransaction) {}
}

export class PaymentTransactionVoidedEvent {
  constructor(public readonly transaction: IPaymentTransaction) {}
}

export class PaymentTransactionFailedEvent {
  constructor(public readonly transaction: IPaymentTransaction) {}
}
