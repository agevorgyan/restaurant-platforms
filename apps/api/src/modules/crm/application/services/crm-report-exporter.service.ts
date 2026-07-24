export enum ExportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON'
}

export interface ExportResult {
  format: ExportFormat;
  data: Buffer | string; // Buffer for PDF/Excel, String for CSV/JSON
  fileName: string;
  contentType: string;
}

export interface IReportExporter {
  export(data: any, format: ExportFormat, reportName: string): Promise<ExportResult>;
}

export class CrmReportExporter implements IReportExporter {
  public async export(data: any, format: ExportFormat, reportName: string): Promise<ExportResult> {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${reportName}_${timestamp}`;

    switch (format) {
      case ExportFormat.JSON:
        return {
          format,
          data: JSON.stringify(data, null, 2),
          fileName: `${fileName}.json`,
          contentType: 'application/json'
        };
      case ExportFormat.CSV:
        return {
          format,
          data: this.convertToCsv(data),
          fileName: `${fileName}.csv`,
          contentType: 'text/csv'
        };
      case ExportFormat.EXCEL:
        return {
          format,
          data: Buffer.from('mock-excel-data'), // In real app, use xlsx or exceljs
          fileName: `${fileName}.xlsx`,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
      case ExportFormat.PDF:
        return {
          format,
          data: Buffer.from('mock-pdf-data'), // In real app, use pdfkit or puppeteer
          fileName: `${fileName}.pdf`,
          contentType: 'application/pdf'
        };
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private convertToCsv(data: any): string {
    // Minimal mock implementation
    if (!data) return '';
    return 'Mock CSV Content';
  }
}
