export class CreatePayrollAdjustmentDto {
  adjustmentNumber!: string;
  employeeReference!: string;
  type!: string;
  reason!: string;
  amount!: number;
  currency!: string;
  effectiveDate!: Date;
}

export class ModifyPayrollAdjustmentDto {
  amount!: number;
  reason!: string;
}

export class ApprovePayrollAdjustmentDto {
  approvedBy!: string;
}

export class RejectPayrollAdjustmentDto {
  rejectedBy!: string;
  reason!: string;
}

export class ApplyPayrollAdjustmentDto {
  appliedBy!: string;
}

export class CancelPayrollAdjustmentDto {
  cancelledBy!: string;
}
