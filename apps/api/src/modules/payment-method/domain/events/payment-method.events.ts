export class PaymentMethodCreatedEvent {
  constructor(public readonly paymentMethodId: string, public readonly restaurantId: string) {}
}

export class PaymentMethodChangedEvent {
  constructor(public readonly paymentMethodId: string, public readonly restaurantId: string) {}
}

export class PaymentMethodActivatedEvent {
  constructor(public readonly paymentMethodId: string, public readonly restaurantId: string) {}
}

export class PaymentMethodDeactivatedEvent {
  constructor(public readonly paymentMethodId: string, public readonly restaurantId: string) {}
}
