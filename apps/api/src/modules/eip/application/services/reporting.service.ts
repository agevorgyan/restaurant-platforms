import { 
  ReportSchedule, 
  ReportSnapshot, 
  ReportDefinition 
} from '../read-models';

export class ReportTemplateService {
  public getTemplate(reportCode: string): ReportDefinition {
    // Mock template resolution
    return {
      reportCode,
      name: `Template for ${reportCode}`,
      description: `Auto-generated template definition for ${reportCode}.`,
      category: 'OPERATIONAL',
      availableFormats: ['PDF', 'CSV', 'XLSX'],
      requiredFilters: ['targetId', 'dateRange']
    };
  }
}

export class ExportService {
  public async exportData(data: any, format: string): Promise<{ downloadUrl: string, fileSizeKb: number }> {
    // Mock export logic - in a real app this would generate the file and upload to S3/R2
    return {
      downloadUrl: `https://storage.restaurant-saas.com/reports/export-${crypto.randomUUID()}.${format.toLowerCase()}`,
      fileSizeKb: Math.floor(Math.random() * 5000) + 100 // Mock size 100KB - 5MB
    };
  }
}

export class DistributionService {
  public async distributeReport(snapshot: ReportSnapshot, channels: string[]): Promise<void> {
    for (const channel of channels) {
      switch (channel) {
        case 'EMAIL':
          // Mock email sending
          console.log(`[Distribution] Sending report ${snapshot.reportId} via EMAIL...`);
          break;
        case 'WEBHOOK':
          // Mock webhook trigger
          console.log(`[Distribution] Triggering webhook for report ${snapshot.reportId}...`);
          break;
        default:
          console.log(`[Distribution] Unknown channel: ${channel}`);
      }
    }
  }
}

export class ReportGenerationService {
  constructor(
    private readonly templateService: ReportTemplateService,
    private readonly exportService: ExportService
  ) {}

  public async generateReport(targetId: string, reportCode: string, format: string, period: string): Promise<ReportSnapshot> {
    const template = this.templateService.getTemplate(reportCode);
    
    // Mock data fetching from EIP projections (KPIs, Forecasts, Benchmarks)
    const mockData = { rows: 500, metrics: ['Revenue', 'Cost'] };
    
    const exportResult = await this.exportService.exportData(mockData, format);

    return {
      reportId: crypto.randomUUID(),
      reportCode,
      targetId,
      type: 'ADHOC',
      category: template.category,
      period,
      format,
      status: 'COMPLETED',
      generatedAt: new Date(),
      downloadUrl: exportResult.downloadUrl,
      fileSizeKb: exportResult.fileSizeKb
    };
  }
}

export class ReportSchedulingService {
  public createSchedule(
    targetId: string, 
    reportCode: string, 
    cronExpression: string, 
    format: string, 
    deliveryChannels: string[]
  ): ReportSchedule {
    return {
      scheduleId: crypto.randomUUID(),
      reportCode,
      targetId,
      cronExpression,
      format,
      deliveryChannels,
      isActive: true,
      nextRunAt: new Date(Date.now() + 86400000) // Mock next run tomorrow
    };
  }
}
