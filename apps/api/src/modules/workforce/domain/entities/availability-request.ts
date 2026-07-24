import { Entity, Identifier } from '@saas/domain';
import { AvailabilityType } from '../value-objects/availability-type';
import { AvailabilityPeriod } from '../value-objects/availability-period';
import { LeaveReason } from '../value-objects/leave-reason';
import { ApprovalStatus, ApprovalStatusEnum } from '../value-objects/approval-status';

export class AvailabilityRequestId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AvailabilityRequestId { return new AvailabilityRequestId(value); }
  public static generate(): AvailabilityRequestId { return new AvailabilityRequestId(crypto.randomUUID()); }
}

export class AvailabilityRequest extends Entity<AvailabilityRequestId> {
  private _status: ApprovalStatus;

  constructor(
    id: AvailabilityRequestId,
    public readonly type: AvailabilityType,
    public readonly period: AvailabilityPeriod,
    public readonly reason: LeaveReason,
    status: ApprovalStatus,
    public readonly requestedAt: Date
  ) {
    super(id);
    this._status = status;
  }

  public static create(type: AvailabilityType, period: AvailabilityPeriod, reason: LeaveReason): AvailabilityRequest {
    return new AvailabilityRequest(
      AvailabilityRequestId.generate(),
      type,
      period,
      reason,
      ApprovalStatus.create(ApprovalStatusEnum.PENDING),
      new Date()
    );
  }

  get status(): ApprovalStatus {
    return this._status;
  }

  public approve(): void {
    if (this._status.toValue() === ApprovalStatusEnum.APPROVED) throw new Error('Already approved.');
    if (this._status.toValue() === ApprovalStatusEnum.CANCELLED) throw new Error('Cannot approve cancelled request.');
    this._status = ApprovalStatus.create(ApprovalStatusEnum.APPROVED);
  }

  public reject(): void {
    if (this._status.toValue() === ApprovalStatusEnum.REJECTED) throw new Error('Already rejected.');
    if (this._status.toValue() === ApprovalStatusEnum.CANCELLED) throw new Error('Cannot reject cancelled request.');
    this._status = ApprovalStatus.create(ApprovalStatusEnum.REJECTED);
  }

  public cancel(): void {
    if (this._status.toValue() === ApprovalStatusEnum.APPROVED) throw new Error('Cannot cancel an approved request without proper withdrawal workflow.');
    this._status = ApprovalStatus.create(ApprovalStatusEnum.CANCELLED);
  }
}
