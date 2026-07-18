export class SupplierContractCreatedEvent {
  constructor(public readonly contractId: string, public readonly restaurantId: string) {}
}

export class SupplierContractActivatedEvent {
  constructor(public readonly contractId: string, public readonly restaurantId: string) {}
}

export class SupplierContractExpiredEvent {
  constructor(public readonly contractId: string, public readonly restaurantId: string) {}
}
