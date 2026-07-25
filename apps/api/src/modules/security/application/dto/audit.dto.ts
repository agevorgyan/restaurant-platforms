import { AuditSeverity } from '../../domain/enums/audit.enums';

export class SearchAuditDto {
  actorId?: string;
  resourceId?: string;
  category?: string;
  severity?: AuditSeverity;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export class ExportAuditDto {
  actorId?: string;
  resourceId?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  format?: 'csv' | 'json' | 'pdf';
}

export class GenerateComplianceReportDto {
  framework!: string;
  periodStart!: Date;
  periodEnd!: Date;
}
