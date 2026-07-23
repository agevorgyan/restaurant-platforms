import { ReservationContractVersion } from '../value-objects/reservation-contract-version.value-object';
import { ExternalReservationIdentity } from '../value-objects/external-reservation-identity.value-object';
import { ReservationContractCompatibility } from '../value-objects/reservation-contract-compatibility.value-object';

export class ReservationContractCompatibilitySpecification {
  public isSatisfiedBy(compatibility: ReservationContractCompatibility): boolean {
    return compatibility.isCompatible;
  }
}

export class ReservationTranslationSpecification {
  public isSatisfiedBy(payload: any): boolean {
    return payload !== null && typeof payload === 'object';
  }
}

export class ReservationReferenceSpecification {
  public isSatisfiedBy(refStr: string): boolean {
    return refStr.trim().length > 0;
  }
}

export class ExternalReservationIdentitySpecification {
  public isSatisfiedBy(identity: ExternalReservationIdentity): boolean {
    return identity.contextName.trim().length > 0 && identity.reference.externalId.trim().length > 0;
  }
}

export class ReservationContractVersionSpecification {
  private readonly supportedVersions = ['1.0', '1.1', '2.0'];
  public isSatisfiedBy(version: ReservationContractVersion): boolean {
    return this.supportedVersions.includes(version.version);
  }
}