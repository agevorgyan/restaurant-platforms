import { BranchReference } from '../value-objects/branch-reference.value-object';
import { ReservationDate } from '../value-objects/reservation-date.value-object';
import { ReservationTime } from '../value-objects/reservation-time.value-object';
import { ReservationDuration } from '../value-objects/reservation-duration.value-object';
import { ReservationPartySize } from '../value-objects/reservation-party-size.value-object';
import { ReservationType } from '../value-objects/reservation-type.value-object';
import { BusinessDate } from '../value-objects/business-date.value-object';

export class AvailabilityContext {
  constructor(
    public readonly branchRef: BranchReference,
    public readonly reservationDate: ReservationDate,
    public readonly reservationTime: ReservationTime,
    public readonly reservationDuration: ReservationDuration,
    public readonly partySize: ReservationPartySize,
    public readonly reservationType: ReservationType,
    public readonly businessDateTime: BusinessDate // Current real-time at the branch
  ) {}
}