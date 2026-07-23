import { ReservationReference } from '../value-objects/reservation-reference.value-object';
import { BranchReference } from '../value-objects/branch-reference.value-object';
import { ReservationDate } from '../value-objects/reservation-date.value-object';
import { ReservationTime } from '../value-objects/reservation-time.value-object';
import { ReservationDuration } from '../value-objects/reservation-duration.value-object';
import { RequiredCapacity } from '../value-objects/required-capacity.value-object';

export class TableAssignmentContext {
  constructor(
    public readonly reservationRef: ReservationReference,
    public readonly branchRef: BranchReference,
    public readonly reservationDate: ReservationDate,
    public readonly reservationTime: ReservationTime,
    public readonly reservationDuration: ReservationDuration,
    public readonly requiredCapacity: RequiredCapacity,
    public readonly preferredArea?: string,
    public readonly preferredTableType?: string
  ) {}
}