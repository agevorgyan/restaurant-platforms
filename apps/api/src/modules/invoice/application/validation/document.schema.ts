import { IssueInvoiceDto, IssueReceiptDto } from '../dto/document.dto';

export const validateIssueInvoice = (dto: IssueInvoiceDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.orderId) errors.push('orderId is required');
  if (!dto.paymentId) errors.push('paymentId is required');
  if (!dto.documentNumber) errors.push('documentNumber is required');
  if (!dto.currency) errors.push('currency is required');
  
  if (!dto.customerSnapshot || !dto.customerSnapshot.customerId || !dto.customerSnapshot.name) {
    errors.push('customerSnapshot with customerId and name is required');
  }

  if (!dto.taxSummary || dto.taxSummary.totalTaxAmount === undefined) {
    errors.push('taxSummary with totalTaxAmount is required');
  }

  // Invoice totals must equal the pricing breakdown
  const expectedTotal = dto.subtotal - dto.discountTotal + dto.taxTotal;
  if (expectedTotal !== dto.grandTotal) {
    errors.push('Invoice totals do not mathematically match the pricing breakdown');
  }

  return errors;
};

export const validateIssueReceipt = (dto: IssueReceiptDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.paymentId) errors.push('paymentId is required');
  if (!dto.documentNumber) errors.push('documentNumber is required');
  if (!dto.paymentReference) errors.push('paymentReference is required');
  if (!dto.currency) errors.push('currency is required');
  
  if (dto.amount === undefined || dto.amount <= 0) {
    errors.push('amount must be greater than zero');
  }
  
  return errors;
};
