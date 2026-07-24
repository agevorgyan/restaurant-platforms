export class CreateFinancialPeriodDto {
  fiscalYear!: number;
  fiscalQuarter!: number;
  fiscalMonth!: number;
  periodCode!: string;
  periodName!: string;
  startDate!: Date;
  endDate!: Date;
}

export class OpenPeriodDto {
  openedBy!: string;
}

export class ClosePeriodDto {
  closedBy!: string;
  closingJournalId!: string;
}

export class LockPeriodDto {
  lockedBy!: string;
}

export class ReopenPeriodDto {
  reopenedBy!: string;
  reason!: string;
  approverId!: string;
}

export class ArchivePeriodDto {
}
