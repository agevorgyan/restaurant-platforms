import { FinancialStatement } from '../read-models/financial-statement.model';

export type ExportFormat = 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'XML';

export interface IReportExporter {
  export(statement: FinancialStatement, format: ExportFormat): Promise<Buffer>;
}

export interface IExportStrategy {
  format: ExportFormat;
  export(statement: FinancialStatement): Promise<Buffer>;
}

export class PdfExportStrategy implements IExportStrategy {
  public format: ExportFormat = 'PDF';
  public async export(statement: FinancialStatement): Promise<Buffer> {
    // Stub for PDF generation (e.g. using pdfkit)
    return Buffer.from(`PDF Report for ${statement.reportType}`);
  }
}

export class ExcelExportStrategy implements IExportStrategy {
  public format: ExportFormat = 'EXCEL';
  public async export(statement: FinancialStatement): Promise<Buffer> {
    // Stub for Excel generation (e.g. using exceljs)
    return Buffer.from(`Excel Report for ${statement.reportType}`);
  }
}

export class CsvExportStrategy implements IExportStrategy {
  public format: ExportFormat = 'CSV';
  public async export(statement: FinancialStatement): Promise<Buffer> {
    // Stub for CSV generation
    return Buffer.from(`CSV Report for ${statement.reportType}`);
  }
}

export class JsonExportStrategy implements IExportStrategy {
  public format: ExportFormat = 'JSON';
  public async export(statement: FinancialStatement): Promise<Buffer> {
    return Buffer.from(JSON.stringify(statement, null, 2));
  }
}

export class XmlExportStrategy implements IExportStrategy {
  public format: ExportFormat = 'XML';
  public async export(statement: FinancialStatement): Promise<Buffer> {
    // Stub for XML generation
    return Buffer.from(`<report><type>${statement.reportType}</type></report>`);
  }
}

export class ReportExportService implements IReportExporter {
  private strategies: Map<ExportFormat, IExportStrategy> = new Map();

  constructor(strategies: IExportStrategy[]) {
    for (const strategy of strategies) {
      this.strategies.set(strategy.format, strategy);
    }
  }

  public async export(statement: FinancialStatement, format: ExportFormat): Promise<Buffer> {
    const strategy = this.strategies.get(format);
    if (!strategy) {
      throw new Error(`Export format ${format} is not supported.`);
    }
    return strategy.export(statement);
  }
}
