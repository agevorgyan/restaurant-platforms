import { Injectable } from '@nestjs/common';
import { PayrollDocument } from '../../domain/aggregates/payroll-document';

export interface IDocumentExporter {
  export(document: PayrollDocument): Promise<Buffer | string>;
  supportsFormat(format: string): boolean;
}

export class CsvExportHandler implements IDocumentExporter {
  supportsFormat(format: string): boolean {
    return format.toLowerCase() === 'csv';
  }
  async export(document: PayrollDocument): Promise<string> {
    return 'id,number,type,status\n' + `${document.id.toValue()},${document.documentNumber.toValue()},${document.type.toValue()},${document.status.toValue()}`;
  }
}

export class JsonExportHandler implements IDocumentExporter {
  supportsFormat(format: string): boolean {
    return format.toLowerCase() === 'json';
  }
  async export(document: PayrollDocument): Promise<string> {
    return JSON.stringify({
      id: document.id.toValue(),
      number: document.documentNumber.toValue(),
      type: document.type.toValue(),
      status: document.status.toValue(),
      version: document.documentVersion.toValue()
    });
  }
}

// Stub representations for complex external formatting engines (PDF, Excel, Government APIs)
export class PdfExportHandler implements IDocumentExporter {
  supportsFormat(format: string): boolean {
    return format.toLowerCase() === 'pdf';
  }
  async export(document: PayrollDocument): Promise<Buffer> {
    return Buffer.from('PDF_BYTE_DATA_MOCK');
  }
}

export class ExcelExportHandler implements IDocumentExporter {
  supportsFormat(format: string): boolean {
    return format.toLowerCase() === 'excel' || format.toLowerCase() === 'xlsx';
  }
  async export(document: PayrollDocument): Promise<Buffer> {
    return Buffer.from('EXCEL_BYTE_DATA_MOCK');
  }
}

export class XmlExportHandler implements IDocumentExporter {
  supportsFormat(format: string): boolean {
    return format.toLowerCase() === 'xml';
  }
  async export(document: PayrollDocument): Promise<string> {
    return `<PayrollDocument id="${document.id.toValue()}"><Number>${document.documentNumber.toValue()}</Number></PayrollDocument>`;
  }
}

export class BankExportHandler implements IDocumentExporter {
  supportsFormat(format: string): boolean {
    return format.toLowerCase() === 'bank';
  }
  async export(document: PayrollDocument): Promise<string> {
    return 'BANK_FILE_FORMAT_MOCK';
  }
}

export class GovernmentExportHandler implements IDocumentExporter {
  supportsFormat(format: string): boolean {
    return format.toLowerCase() === 'government';
  }
  async export(document: PayrollDocument): Promise<string> {
    return 'GOV_XML_COMPLIANT_FORMAT_MOCK';
  }
}

@Injectable()
export class DocumentExportService {
  private handlers: IDocumentExporter[];

  constructor() {
    this.handlers = [
      new CsvExportHandler(),
      new JsonExportHandler(),
      new PdfExportHandler(),
      new ExcelExportHandler(),
      new XmlExportHandler(),
      new BankExportHandler(),
      new GovernmentExportHandler()
    ];
  }

  async exportDocument(document: PayrollDocument, format: string): Promise<Buffer | string> {
    const handler = this.handlers.find(h => h.supportsFormat(format));
    if (!handler) {
      throw new Error(`Export format not supported: ${format}`);
    }
    return handler.export(document);
  }
}
