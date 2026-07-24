export class CreatePayrollRunDto {
  periodStartDate!: Date;
  periodEndDate!: Date;
  runType!: string;
}

export class CalculatePayrollRunDto {
  // Trigger payload
}

export class ApprovePayrollRunDto {
  approvedBy!: string;
  remarks?: string;
}

export class RejectPayrollRunDto {
  rejectedBy!: string;
  reason!: string;
}

export class FinalizePayrollRunDto {
  finalizedBy!: string;
}

export class ReopenPayrollRunDto {
  reopenedBy!: string;
  reason!: string;
}

export class ExportPayrollRunDto {
  format!: string;
  destination!: string;
}
