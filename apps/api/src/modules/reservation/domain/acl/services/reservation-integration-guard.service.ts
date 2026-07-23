import { ReservationCorrelationId } from '../value-objects/reservation-correlation-id.value-object';
import { ReservationACLPolicy } from '../policies/reservation-acl.policies';

export class ReservationIntegrationGuard {
  public guard(correlationIdStr?: string): ReservationCorrelationId {
    const hasCorr = !!correlationIdStr;
    ReservationACLPolicy.enforce(hasCorr);
    return ReservationCorrelationId.create(correlationIdStr!);
  }
}