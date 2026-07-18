import { CreatePurchaseInvoiceDto, PurchaseInvoiceLineDto } from '../dto/purchase-invoice.dto';

const validateLine = (line: PurchaseInvoiceLineDto, index: number): string[] => {
  const errors: string[] = [];
  if (!line.ingredientId || line.ingredientId.trim() === '') errors.push(`Line [${index}]: ingredientId is required`);
  if (!line.description || line.description.trim() === '') errors.push(`Line [${index}]: description is required`);
  if (typeof line.quantity !== 'number' || line.quantity <= 0) errors.push(`Line [${index}]: quantity must be greater than zero`);
  if (!line.unitOfMeasure || line.unitOfMeasure.trim() === '') errors.push(`Line [${index}]: unitOfMeasure is required`);
  if (typeof line.unitPrice !== 'number' || line.unitPrice < 0) errors.push(`Line [${index}]: unitPrice cannot be negative`);
  if (typeof line.discount !== 'number' || line.discount < 0) errors.push(`Line [${index}]: discount cannot be negative`);
  if (typeof line.taxRate !== 'number' || line.taxRate < 0) errors.push(`Line [${index}]: taxRate cannot be negative`);
  return errors;
};

export const validateCreatePurchaseInvoice = (dto: CreatePurchaseInvoiceDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId || dto.restaurantId.trim() === '') errors.push('restaurantId is required');
  if (!dto.supplierId || dto.supplierId.trim() === '') errors.push('supplierId is required');
  if (!dto.invoiceNumber || dto.invoiceNumber.trim() === '') errors.push('invoiceNumber is required');
  if (!dto.supplierInvoiceNumber || dto.supplierInvoiceNumber.trim() === '') errors.push('supplierInvoiceNumber is required');
  if (!dto.currency || dto.currency.trim() === '') errors.push('currency is required');
  if (!(dto.invoiceDate instanceof Date) || isNaN(dto.invoiceDate.getTime())) errors.push('invoiceDate must be a valid date');
  if (!(dto.dueDate instanceof Date) || isNaN(dto.dueDate.getTime())) errors.push('dueDate must be a valid date');

  if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
    errors.push('Purchase invoice must contain at least one line');
  } else {
    dto.lines.forEach((line, index) => {
      errors.push(...validateLine(line, index));
    });

    const poLineIds = dto.lines
      .map(l => l.purchaseOrderLineId)
      .filter((id): id is string => id !== undefined && id.trim() !== '');
      
    if (new Set(poLineIds).size !== poLineIds.length) {
      errors.push('Duplicate purchase order lines are not allowed within the same invoice');
    }
  }

  return errors;
};
