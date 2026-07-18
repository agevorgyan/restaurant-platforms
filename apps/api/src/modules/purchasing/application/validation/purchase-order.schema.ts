import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto, PurchaseOrderLineDto } from '../dto/purchase-order.dto';

const validateLine = (line: PurchaseOrderLineDto, index: number): string[] => {
  const errors: string[] = [];
  if (!line.ingredientId || line.ingredientId.trim() === '') errors.push(`Line [${index}]: ingredientId is required`);
  if (!line.description || line.description.trim() === '') errors.push(`Line [${index}]: description is required`);
  if (typeof line.orderedQuantity !== 'number' || line.orderedQuantity <= 0) errors.push(`Line [${index}]: orderedQuantity must be greater than zero`);
  if (!line.unitOfMeasure || line.unitOfMeasure.trim() === '') errors.push(`Line [${index}]: unitOfMeasure is required`);
  if (typeof line.unitPrice !== 'number' || line.unitPrice < 0) errors.push(`Line [${index}]: unitPrice cannot be negative`);
  if (typeof line.discount !== 'number' || line.discount < 0) errors.push(`Line [${index}]: discount cannot be negative`);
  if (typeof line.taxRate !== 'number' || line.taxRate < 0) errors.push(`Line [${index}]: taxRate cannot be negative`);
  return errors;
};

export const validateCreatePurchaseOrder = (dto: CreatePurchaseOrderDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId || dto.restaurantId.trim() === '') errors.push('restaurantId is required');
  if (!dto.supplierId || dto.supplierId.trim() === '') errors.push('supplierId is required');
  if (!dto.purchaseOrderNumber || dto.purchaseOrderNumber.trim() === '') errors.push('purchaseOrderNumber is required');
  if (!dto.currency || dto.currency.trim() === '') errors.push('currency is required');

  if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
    errors.push('Purchase order must contain at least one line');
  } else {
    dto.lines.forEach((line, index) => {
      errors.push(...validateLine(line, index));
    });

    const ingredientIds = dto.lines.map(l => l.ingredientId);
    if (new Set(ingredientIds).size !== ingredientIds.length) {
      errors.push('Duplicate ingredients within the same purchase order are not allowed');
    }
  }

  return errors;
};

export const validateUpdatePurchaseOrder = (dto: UpdatePurchaseOrderDto): string[] => {
  const errors: string[] = [];

  if (dto.currency !== undefined && dto.currency.trim() === '') errors.push('currency cannot be empty');

  if (dto.lines !== undefined) {
    if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
      errors.push('Purchase order must contain at least one line');
    } else {
      dto.lines.forEach((line, index) => {
        errors.push(...validateLine(line, index));
      });

      const ingredientIds = dto.lines.map(l => l.ingredientId);
      if (new Set(ingredientIds).size !== ingredientIds.length) {
        errors.push('Duplicate ingredients within the same purchase order are not allowed');
      }
    }
  }

  return errors;
};
