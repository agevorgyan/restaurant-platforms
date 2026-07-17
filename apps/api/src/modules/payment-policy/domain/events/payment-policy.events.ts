import { IPaymentPolicy } from '../entities/payment-policy.interface';

export class PaymentPolicyCreatedEvent {
  constructor(public readonly policy: IPaymentPolicy) {}
}

export class PaymentPolicyUpdatedEvent {
  constructor(public readonly policy: IPaymentPolicy) {}
}

export class PaymentPolicyActivatedEvent {
  constructor(public readonly policy: IPaymentPolicy) {}
}

export class PaymentPolicyDeactivatedEvent {
  constructor(public readonly policy: IPaymentPolicy) {}
}
