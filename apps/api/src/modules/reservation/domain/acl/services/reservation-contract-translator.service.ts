import { ReservationTranslationResult } from '../value-objects/reservation-translation-result.value-object';
import { ReservationTranslationSpecification } from '../specifications/reservation-acl.specifications';
import { ReservationTranslationPolicy } from '../policies/reservation-acl.policies';

export class ReservationContractTranslator {
  private readonly spec = new ReservationTranslationSpecification();

  public translate(payload: any): ReservationTranslationResult {
    const isValid = this.spec.isSatisfiedBy(payload);
    ReservationTranslationPolicy.enforce(isValid);

    // Dummy deterministic translation logic protecting the Reservation domain
    const translatedData = {
      internalReference: crypto.randomUUID(),
      sanitizedPayload: { ...payload, __translatedAt: new Date().toISOString() }
    };

    return ReservationTranslationResult.create(true, translatedData);
  }
}