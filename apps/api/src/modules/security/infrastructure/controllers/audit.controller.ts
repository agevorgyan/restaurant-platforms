/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  AuditService,
  ComplianceService,
  EvidenceService,
  AuditSearchService,
  ExportService,
} from '../../application/services';
import {
  SearchAuditDto,
  ExportAuditDto,
  GenerateComplianceReportDto,
} from '../../application/dto';

@Controller('security')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly complianceService: ComplianceService,
    private readonly evidenceService: EvidenceService,
    private readonly auditSearchService: AuditSearchService,
    private readonly exportService: ExportService,
  ) {}

  @Get('audit')
  async getAuditRecords() {
    return this.auditSearchService.searchAuditRecords({});
  }

  @Get('audit/:id')
  async getAuditRecord(@Param('id') id: string) {
    return this.auditService.getAuditRecord(id);
  }

  @Post('audit/search')
  async searchAudit(@Body() dto: SearchAuditDto) {
    return this.auditSearchService.searchAuditRecords(dto);
  }

  @Post('audit/export')
  async exportAudit(@Body() dto: ExportAuditDto) {
    return this.exportService.exportAuditLogs(dto);
  }

  @Get('compliance')
  async getComplianceStatus() {
    return this.complianceService.getComplianceReports();
  }

  @Get('compliance/reports')
  async getComplianceReports() {
    return this.complianceService.getComplianceReports();
  }

  @Post('compliance/report')
  async generateComplianceReport(@Body() dto: GenerateComplianceReportDto) {
    return this.complianceService.generateReport(dto);
  }

  @Get('evidence')
  async getEvidence() {
    return this.evidenceService.getEvidenceCatalog();
  }
}
