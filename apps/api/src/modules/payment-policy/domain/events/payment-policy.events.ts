export class PaymentPolicyCreatedEvent {
  constructor(public readonly policyId: string, public readonly restaurantId: string) {}
}

export class PaymentPolicyUpdatedEvent {
  constructor(public readonly policyId: string, public readonly restaurantId: string) {}
}

export class PaymentPolicyActivatedEvent {
  constructor(public readonly policyId: string, public readonly restaurantId: string) {}
}

export class PaymentPolicyDeactivatedEvent {
  constructor(public readonly policyId: string, public readonly restaurantId: string) {}
}
