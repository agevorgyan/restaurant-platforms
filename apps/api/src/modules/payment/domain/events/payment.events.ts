import { IPayment } from '../entities/payment.interface';

export class PaymentCreatedEvent {
  constructor(public readonly payment: IPayment) {}
}

export class PaymentAuthorizedEvent {
  constructor(public readonly payment: IPayment) {}
}

export class PaymentCancelledEvent {
  constructor(public readonly payment: IPayment) {}
}
