export class CreatePayrollDocumentDto {
  documentNumber!: string;
  type!: string;
  periodStartDate!: Date;
  periodEndDate!: Date;
}

export class GeneratePayrollDocumentDto {
  sections!: any[];
  attachments!: any[];
}

export class ApprovePayrollDocumentDto {
  approverId!: string;
  role!: string;
  comments?: string;
  signatureHash?: string;
}

export class FinalizePayrollDocumentDto {
  finalizedBy!: string;
}

export class ArchivePayrollDocumentDto {
  archivedBy!: string;
}
