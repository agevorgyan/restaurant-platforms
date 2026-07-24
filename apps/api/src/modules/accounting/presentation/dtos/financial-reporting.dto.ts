export class BaseReportQueryDto {
  periodId?: string;
  startDate?: Date;
  endDate?: Date;
  currency?: string;
  exportFormat?: 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'XML';
}

export class LedgerReportQueryDto extends BaseReportQueryDto {
  accountId!: string;
}

export class AgingReportQueryDto extends BaseReportQueryDto {
  asOfDate!: Date;
  intervalDays?: number; // e.g., 30 for 30/60/90 days
}
