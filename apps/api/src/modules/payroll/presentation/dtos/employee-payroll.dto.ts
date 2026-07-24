export class CreateEmployeePayrollDto {
  employeeReference!: string;
  payrollPeriodId!: string;
  baseSalary!: number;
  hourlyRate!: number;
  currency!: string;
}

export class ImportAttendanceDto {
  workedHours!: any[]; // To be strongly typed in real implementation
}

export class CalculateEmployeePayrollDto {
  // Trigger payload
}

export class ApproveEmployeePayrollDto {
  approvedBy!: string;
}

export class RejectEmployeePayrollDto {
  rejectedBy!: string;
  reason!: string;
}

export class FinalizeEmployeePayrollDto {
  finalizedBy!: string;
}
