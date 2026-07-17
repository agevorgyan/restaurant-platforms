export class RefundRequestedEvent {
  constructor(public readonly refundId: string, public readonly paymentId: string) {}
}

export class RefundApprovedEvent {
  constructor(public readonly refundId: string, public readonly paymentId: string) {}
}

export class RefundRejectedEvent {
  constructor(public readonly refundId: string, public readonly paymentId: string) {}
}

export class RefundCompletedEvent {
  constructor(public readonly refundId: string, public readonly paymentId: string) {}
}
