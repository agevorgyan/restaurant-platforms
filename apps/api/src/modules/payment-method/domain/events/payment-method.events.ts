import { IPaymentMethod } from '../entities/payment-method.interface';

export class PaymentMethodCreatedEvent {
  constructor(public readonly paymentMethod: IPaymentMethod) {}
}

export class PaymentMethodUpdatedEvent {
  constructor(public readonly paymentMethod: IPaymentMethod) {}
}

export class PaymentMethodActivatedEvent {
  constructor(public readonly paymentMethod: IPaymentMethod) {}
}

export class PaymentMethodDeactivatedEvent {
  constructor(public readonly paymentMethod: IPaymentMethod) {}
}
