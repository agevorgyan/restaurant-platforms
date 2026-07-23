import { ReservationContractVersion } from '../value-objects/reservation-contract-version.value-object';
import { ReservationContractVersionSpecification } from '../specifications/reservation-acl.specifications';
import { ReservationVersionNegotiationPolicy } from '../policies/reservation-acl.policies';

export class ReservationVersionNegotiator {
  private readonly spec = new ReservationContractVersionSpecification();

  public negotiate(versionStr: string): ReservationContractVersion {
    const version = ReservationContractVersion.create(versionStr);
    const isSupported = this.spec.isSatisfiedBy(version);
    ReservationVersionNegotiationPolicy.enforce(isSupported);
    return version;
  }
}