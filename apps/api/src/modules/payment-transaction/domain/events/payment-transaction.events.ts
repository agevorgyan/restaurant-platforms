export class PaymentTransactionCreatedEvent {
  constructor(public readonly transactionId: string, public readonly paymentId: string) {}
}

export class PaymentTransactionAuthorizedEvent {
  constructor(public readonly transactionId: string, public readonly paymentId: string) {}
}

export class PaymentTransactionCapturedEvent {
  constructor(public readonly transactionId: string, public readonly paymentId: string) {}
}

export class PaymentTransactionVoidedEvent {
  constructor(public readonly transactionId: string, public readonly paymentId: string) {}
}

export class PaymentTransactionFailedEvent {
  constructor(public readonly transactionId: string, public readonly paymentId: string) {}
}
