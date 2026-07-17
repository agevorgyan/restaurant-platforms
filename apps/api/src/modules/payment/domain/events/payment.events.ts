export class PaymentCreatedEvent {
  constructor(public readonly paymentId: string, public readonly orderId: string) {}
}

export class PaymentAuthorizedEvent {
  constructor(public readonly paymentId: string, public readonly orderId: string) {}
}

export class PaymentCapturedEvent {
  constructor(public readonly paymentId: string, public readonly orderId: string) {}
}

export class PaymentFailedEvent {
  constructor(public readonly paymentId: string, public readonly orderId: string) {}
}

export class PaymentRefundedEvent {
  constructor(public readonly paymentId: string, public readonly orderId: string) {}
}

export class PaymentCancelledEvent {
  constructor(public readonly paymentId: string, public readonly orderId: string) {}
}
