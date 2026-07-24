export class CreatePayableDto {
  number!: string;
  supplierReference!: string;
  originalAmount!: number;
  issueDate!: Date;
  dueDate!: Date;
  paymentTerms!: string;
  currency!: string;
}

export class RegisterInvoiceDto {
  vendorInvoiceNumber!: string;
}

export class ApprovePayableDto {
  approverId!: string;
}

export class AllocatePaymentDto {
  paymentReference!: string;
  amount!: number;
}

export class ApplyCreditNoteDto {
  creditNoteReference!: string;
  amount!: number;
  reason!: string;
}

export class WriteOffDto {
  amount!: number;
  reason!: string;
  approverId!: string;
}

export class ReopenPayableDto {
  reason!: string;
}
