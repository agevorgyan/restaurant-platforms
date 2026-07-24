export class CreateReceivableDto {
  number!: string;
  customerReference!: string;
  originalAmount!: number;
  issueDate!: Date;
  dueDate!: Date;
  creditTerms!: string;
}

export class IssueInvoiceDto {
  invoiceReference!: string;
}

export class AllocatePaymentDto {
  paymentReference!: string;
  amount!: number;
}

export class WriteOffDto {
  amount!: number;
  reason!: string;
  approverId!: string;
}

export class ReopenReceivableDto {
  reason!: string;
}
