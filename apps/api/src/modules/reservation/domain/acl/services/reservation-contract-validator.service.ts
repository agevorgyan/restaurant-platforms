import { ReservationContractCompatibility } from '../value-objects/reservation-contract-compatibility.value-object';
import { ReservationContractType } from '../value-objects/reservation-contract-type.value-object';
import { ReservationContractRegistry } from './reservation-contract-registry.service';
import { ReservationContractCompatibilityPolicy } from '../policies/reservation-acl.policies';

export class ReservationContractValidator {
  constructor(private readonly registry: ReservationContractRegistry) {}

  public validate(contractType: ReservationContractType): ReservationContractCompatibility {
    const isSupported = this.registry.isSupported(contractType);
    const compatibility = ReservationContractCompatibility.create(isSupported);
    ReservationContractCompatibilityPolicy.enforce(compatibility.isCompatible);
    return compatibility;
  }
}