export class CreateLedgerDto {
  code!: string;
  name!: string;
  type!: string;
  baseCurrency!: string;
  fiscalYear!: number;
  fiscalStartDate!: Date;
  fiscalEndDate!: Date;
  openingBalance!: number;
}

export class OpenLedgerDto {
  performedBy!: string;
}

export class CloseLedgerDto {
  closingBalance!: number;
  performedBy!: string;
}

export class ArchiveLedgerDto {
  performedBy!: string;
}
