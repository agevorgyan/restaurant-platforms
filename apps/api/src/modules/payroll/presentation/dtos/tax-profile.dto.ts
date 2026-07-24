export class CreateTaxProfileDto {
  code!: string;
  name!: string;
  jurisdiction!: string;
  residency!: string;
  category!: string;
  currency!: string;
  effectivePeriod!: { startDate: Date, endDate?: Date };
  employeeReference?: string;
}

export class ActivateTaxProfileDto {
  activatedBy!: string;
}

export class DeactivateTaxProfileDto {
  deactivatedBy!: string;
}

export class ArchiveTaxProfileDto {
  archivedBy!: string;
}
