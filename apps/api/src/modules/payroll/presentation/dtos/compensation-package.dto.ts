export class CreateCompensationPackageDto {
  employeeReference!: string;
  compensationType!: string;
  currency!: string;
  effectivePeriod!: { startDate: Date, endDate?: Date };
  baseSalary!: number;
  hourlyRate!: number;
  overtimeRate!: number;
  nightShiftRate!: number;
  holidayRate!: number;
  weekendRate!: number;
}

export class UpdateCompensationPackageDto {
  baseSalary?: number;
  hourlyRate?: number;
  overtimeRate?: number;
  nightShiftRate?: number;
  holidayRate?: number;
  weekendRate?: number;
}

export class ActivatePackageDto {
  activatedBy!: string;
}

export class DeactivatePackageDto {
  deactivatedBy!: string;
}

export class ArchivePackageDto {
  archivedBy!: string;
}
