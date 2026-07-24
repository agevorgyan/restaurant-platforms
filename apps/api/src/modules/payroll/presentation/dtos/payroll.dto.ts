export class CreatePayrollDto {
  periodStartDate!: Date;
  periodEndDate!: Date;
}

export class CalculatePayrollDto {
  // Trigger payload
}

export class ApprovePayrollDto {
  approvedBy!: string;
}

export class FinalizePayrollDto {
  finalizedBy!: string;
}

export class ExportPayrollDto {
  format!: string;
  destination!: string;
}
