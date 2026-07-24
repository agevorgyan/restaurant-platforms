export class CreatePayrollPreparationDto {
  startDate!: Date;
  endDate!: Date;
}

export class CollectPayrollDataDto {
  // Normally this would take parameters or be triggered, assuming an internal trigger for the demo
}

export class ValidatePayrollPreparationDto {
  // Trigger payload
}

export class FinalizePayrollPreparationDto {
  userId!: string;
}

export class ReopenPayrollPreparationDto {
  userId!: string;
  reason!: string;
}

export class ExportPayrollPreparationDto {
  format!: string;
  destinationSystem!: string;
  userId!: string;
}
