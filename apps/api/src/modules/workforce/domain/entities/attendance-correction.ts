import { Entity, Identifier } from '@saas/domain';

export class AttendanceCorrectionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AttendanceCorrectionId { return new AttendanceCorrectionId(value); }
  public static generate(): AttendanceCorrectionId { return new AttendanceCorrectionId(crypto.randomUUID()); }
}

export enum CorrectionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export class AttendanceCorrection extends Entity<AttendanceCorrectionId> {
  constructor(
    id: AttendanceCorrectionId,
    public readonly proposedCheckIn: Date,
    public readonly proposedCheckOut: Date,
    public readonly reason: string,
    public readonly status: CorrectionStatus,
    public readonly requestedAt: Date
  ) {
    super(id);
  }

  public static create(proposedCheckIn: Date, proposedCheckOut: Date, reason: string): AttendanceCorrection {
    if (proposedCheckOut < proposedCheckIn) {
      throw new Error('Proposed check-out cannot be before check-in.');
    }
    return new AttendanceCorrection(AttendanceCorrectionId.generate(), proposedCheckIn, proposedCheckOut, reason, CorrectionStatus.PENDING, new Date());
  }

  public approve(): AttendanceCorrection {
    return new AttendanceCorrection(this.id, this.proposedCheckIn, this.proposedCheckOut, this.reason, CorrectionStatus.APPROVED, this.requestedAt);
  }

  public reject(): AttendanceCorrection {
    return new AttendanceCorrection(this.id, this.proposedCheckIn, this.proposedCheckOut, this.reason, CorrectionStatus.REJECTED, this.requestedAt);
  }
}
