import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { 
  ReportSnapshot, 
  ReportSchedule,
  ReportHistory
} from '../../application/read-models';
import { 
  ReportGenerationService, 
  ReportSchedulingService 
} from '../../application/services';

@Controller('enterprise/reports')
export class EnterpriseReportingController {
  constructor(
    private readonly generationService: ReportGenerationService,
    private readonly schedulingService: ReportSchedulingService
  ) {}

  @Get()
  async getReportsList(@Query('targetId') targetId: string): Promise<ReportSnapshot[]> {
    // Mock listing previously generated reports
    return [{
      reportId: 'rep-1',
      reportCode: 'FIN_SUMMARY',
      targetId: targetId || 'default-org',
      type: 'ADHOC',
      category: 'FINANCIAL',
      period: 'MONTHLY',
      format: 'PDF',
      status: 'COMPLETED',
      generatedAt: new Date(),
      downloadUrl: 'https://storage.restaurant-saas.com/reports/fin-1.pdf',
      fileSizeKb: 1024
    }];
  }

  @Get('history')
  async getReportHistory(
    @Query('targetId') targetId: string,
    @Query('reportCode') reportCode: string
  ): Promise<ReportHistory> {
    return {
      targetId: targetId || 'default-org',
      reportCode: reportCode || 'FIN_SUMMARY',
      historicalSnapshots: []
    };
  }

  @Get(':id')
  async getReportById(@Param('id') id: string): Promise<ReportSnapshot | null> {
    // Mock fetching a single report
    return {
      reportId: id,
      reportCode: 'FIN_SUMMARY',
      targetId: 'default-org',
      type: 'ADHOC',
      category: 'FINANCIAL',
      period: 'MONTHLY',
      format: 'PDF',
      status: 'COMPLETED',
      generatedAt: new Date(),
      downloadUrl: `https://storage.restaurant-saas.com/reports/${id}.pdf`,
      fileSizeKb: 1024
    };
  }

  @Post('generate')
  async generateReport(
    @Body() payload: { targetId: string, reportCode: string, format: string, period: string }
  ): Promise<ReportSnapshot> {
    return this.generationService.generateReport(
      payload.targetId,
      payload.reportCode,
      payload.format || 'PDF',
      payload.period || 'MONTHLY'
    );
  }

  @Post('schedule')
  async scheduleReport(
    @Body() payload: { targetId: string, reportCode: string, cronExpression: string, format: string, deliveryChannels: string[] }
  ): Promise<ReportSchedule> {
    return this.schedulingService.createSchedule(
      payload.targetId,
      payload.reportCode,
      payload.cronExpression,
      payload.format || 'PDF',
      payload.deliveryChannels || ['EMAIL']
    );
  }
}
