export class CreateAvailabilityDto {
  staffId!: string;
  initialVacationBalance?: number;
}

export class UpdateAvailabilityDto {
  status?: string;
}

export class RequestTimeOffDto {
  availabilityId!: string;
  type!: string;
  startDate!: Date;
  endDate!: Date;
  reason!: string;
}

export class ApproveTimeOffDto {
  availabilityId!: string;
  requestId!: string;
  approverId!: string;
}

export class RejectTimeOffDto {
  availabilityId!: string;
  requestId!: string;
  approverId!: string;
}

export class CancelTimeOffDto {
  availabilityId!: string;
  requestId!: string;
}

export class RecordSickLeaveDto {
  availabilityId!: string;
  startDate!: Date;
  endDate!: Date;
  reason!: string;
}

export class RecordVacationDto {
  availabilityId!: string;
  startDate!: Date;
  endDate!: Date;
  reason!: string;
}
