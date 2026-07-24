import { AggregateRoot, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';
import { AvailabilityStatus, AvailabilityStatusEnum } from '../value-objects/availability-status';
import { AvailabilityType, AvailabilityTypeEnum } from '../value-objects/availability-type';
import { AvailabilityPeriod } from '../value-objects/availability-period';
import { LeaveReason } from '../value-objects/leave-reason';
import { VacationBalance } from '../value-objects/vacation-balance';
import { ApprovalStatusEnum } from '../value-objects/approval-status';
import { AvailabilityRequest } from '../entities/availability-request';
import { AvailabilityCreated, TimeOffRequested, TimeOffCancelled, TimeOffApproved, TimeOffRejected, VacationRecorded, SickLeaveRecorded, AvailabilityUpdated } from '../events/availability-events';

export class AvailabilityId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AvailabilityId { return new AvailabilityId(value); }
  public static generate(): AvailabilityId { return new AvailabilityId(crypto.randomUUID()); }
}

export class Availability extends AggregateRoot<AvailabilityId> {
  private _status: AvailabilityStatus;
  private _vacationBalance: VacationBalance;
  private _requests: AvailabilityRequest[] = [];

  constructor(
    id: AvailabilityId,
    public readonly staffId: StaffId,
    status: AvailabilityStatus = AvailabilityStatus.create(AvailabilityStatusEnum.ACTIVE),
    vacationBalance: VacationBalance = VacationBalance.create(0)
  ) {
    super(id);
    this._status = status;
    this._vacationBalance = vacationBalance;
  }

  public static create(staffId: StaffId, initialVacationBalance: number = 0): Availability {
    const id = AvailabilityId.generate();
    const availability = new Availability(
      id,
      staffId,
      AvailabilityStatus.create(AvailabilityStatusEnum.ACTIVE),
      VacationBalance.create(initialVacationBalance)
    );

    availability.record(new AvailabilityCreated(id.toValue(), availability.version(), {
      availabilityId: id.toValue(),
      staffId: staffId.toValue(),
      status: AvailabilityStatusEnum.ACTIVE
    }));

    return availability;
  }

  get status(): AvailabilityStatus { return this._status; }
  get vacationBalance(): VacationBalance { return this._vacationBalance; }
  get requests(): AvailabilityRequest[] { return [...this._requests]; }

  public updateStatus(status: AvailabilityStatusEnum): void {
    this._status = AvailabilityStatus.create(status);
    this.record(new AvailabilityUpdated(this.id.toValue(), this.version(), {
      availabilityId: this.id.toValue(),
      status
    }));
  }

  public requestTimeOff(type: AvailabilityType, period: AvailabilityPeriod, reason: LeaveReason): string {
    // Invariants:
    // Overlapping approved requests are forbidden - we do a quick check against our own records here.
    // Real conflict detection should also check across all branch schedules, but here we enforce local consistency.
    for (const req of this._requests) {
      if (req.status.toValue() === ApprovalStatusEnum.APPROVED && req.period.overlaps(period)) {
        throw new Error('Overlapping approved requests are forbidden.');
      }
    }

    const request = AvailabilityRequest.create(type, period, reason);
    this._requests.push(request);

    this.record(new TimeOffRequested(this.id.toValue(), this.version(), {
      availabilityId: this.id.toValue(),
      requestId: request.id.toValue(),
      type: type.toValue(),
      startDate: period.toValue().startDate,
      endDate: period.toValue().endDate
    }));

    return request.id.toValue();
  }

  public cancelRequest(requestId: string): void {
    const request = this._requests.find(r => r.id.toValue() === requestId);
    if (!request) throw new Error('Request not found.');

    request.cancel();

    this.record(new TimeOffCancelled(this.id.toValue(), this.version(), {
      availabilityId: this.id.toValue(),
      requestId
    }));
  }

  public approveRequest(requestId: string, approverId: StaffId): void {
    const request = this._requests.find(r => r.id.toValue() === requestId);
    if (!request) throw new Error('Request not found.');

    if (request.type.toValue() === AvailabilityTypeEnum.VACATION) {
      const days = Math.ceil((request.period.toValue().endDate.getTime() - request.period.toValue().startDate.getTime()) / (1000 * 60 * 60 * 24));
      // Invariant: Vacation balance cannot become negative.
      this._vacationBalance = this._vacationBalance.deduct(days);
    }

    request.approve();

    this.record(new TimeOffApproved(this.id.toValue(), this.version(), {
      availabilityId: this.id.toValue(),
      requestId,
      approverId: approverId.toValue()
    }));
  }

  public rejectRequest(requestId: string, approverId: StaffId): void {
    const request = this._requests.find(r => r.id.toValue() === requestId);
    if (!request) throw new Error('Request not found.');

    request.reject();

    this.record(new TimeOffRejected(this.id.toValue(), this.version(), {
      availabilityId: this.id.toValue(),
      requestId,
      approverId: approverId.toValue()
    }));
  }

  public recordSickLeave(period: AvailabilityPeriod, reason: LeaveReason): void {
    const request = AvailabilityRequest.create(AvailabilityType.create(AvailabilityTypeEnum.SICK_LEAVE), period, reason);
    request.approve(); // Sick leave is implicitly approved or recorded retroactively
    this._requests.push(request);

    this.record(new SickLeaveRecorded(this.id.toValue(), this.version(), {
      availabilityId: this.id.toValue(),
      requestId: request.id.toValue()
    }));
  }

  public recordVacation(period: AvailabilityPeriod, reason: LeaveReason): void {
    const request = AvailabilityRequest.create(AvailabilityType.create(AvailabilityTypeEnum.VACATION), period, reason);
    
    const days = Math.ceil((period.toValue().endDate.getTime() - period.toValue().startDate.getTime()) / (1000 * 60 * 60 * 24));
    this._vacationBalance = this._vacationBalance.deduct(days);

    request.approve();
    this._requests.push(request);

    this.record(new VacationRecorded(this.id.toValue(), this.version(), {
      availabilityId: this.id.toValue(),
      requestId: request.id.toValue(),
      daysDeducted: days
    }));
  }
}
