import { ExternalReservationIdentity } from '../value-objects/external-reservation-identity.value-object';
import { ExternalReservationReference } from '../value-objects/external-reservation-reference.value-object';
import { ExternalReservationIdentitySpecification } from '../specifications/reservation-acl.specifications';
import { ReservationExternalReferencePolicy } from '../policies/reservation-acl.policies';

export class ReservationReferenceResolver {
  private readonly spec = new ExternalReservationIdentitySpecification();

  public resolve(contextName: string, systemId: string, externalId: string): ExternalReservationIdentity {
    const ref = ExternalReservationReference.create(systemId, externalId);
    const identity = ExternalReservationIdentity.create(ref, contextName);
    
    const isValid = this.spec.isSatisfiedBy(identity);
    ReservationExternalReferencePolicy.enforce(isValid);

    return identity;
  }
}