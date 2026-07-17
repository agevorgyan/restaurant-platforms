

export class IssueInvoiceDto {
  restaurantId: string;
  orderId: string;
  paymentId: string;
  documentNumber: string;
  customerSnapshot: {
    customerId: string;
    name: string;
    email?: string;
    phone?: string;
    taxId?: string;
  };
  taxSummary: {
    breakdown: Array<{
      taxName: string;
      taxRate: number;
      taxableAmount: number;
      taxAmount: number;
    }>;
    totalTaxAmount: number;
  };
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
}

export class IssueReceiptDto {
  restaurantId: string;
  paymentId: string;
  documentNumber: string;
  paymentReference: string;
  amount: number;
  currency: string;
}
