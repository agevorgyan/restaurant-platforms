import { ITaxPolicy } from '../entities/tax-policy.interface';

export class TaxPolicyCreatedEvent {
  constructor(public readonly taxPolicy: ITaxPolicy) {}
}

export class TaxPolicyUpdatedEvent {
  constructor(public readonly taxPolicy: ITaxPolicy) {}
}
