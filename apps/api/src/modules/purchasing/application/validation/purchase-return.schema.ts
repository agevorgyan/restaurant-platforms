import { CreatePurchaseReturnDto, PurchaseReturnLineDto } from '../dto/purchase-return.dto';

const validateLine = (line: PurchaseReturnLineDto, index: number): string[] => {
  const errors: string[] = [];
  if (!line.goodsReceiptLineId || line.goodsReceiptLineId.trim() === '') errors.push(`Line [${index}]: goodsReceiptLineId is required`);
  if (!line.ingredientId || line.ingredientId.trim() === '') errors.push(`Line [${index}]: ingredientId is required`);
  if (typeof line.returnedQuantity !== 'number' || line.returnedQuantity <= 0) errors.push(`Line [${index}]: returnedQuantity must be greater than zero`);
  if (typeof line.acceptedReturnQuantity !== 'number' || line.acceptedReturnQuantity < 0) errors.push(`Line [${index}]: acceptedReturnQuantity cannot be negative`);
  if (!line.unitOfMeasure || line.unitOfMeasure.trim() === '') errors.push(`Line [${index}]: unitOfMeasure is required`);
  return errors;
};

export const validateCreatePurchaseReturn = (dto: CreatePurchaseReturnDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId || dto.restaurantId.trim() === '') errors.push('restaurantId is required');
  if (!dto.supplierId || dto.supplierId.trim() === '') errors.push('supplierId is required');
  if (!dto.goodsReceiptId || dto.goodsReceiptId.trim() === '') errors.push('goodsReceiptId is required');
  if (!dto.returnNumber || dto.returnNumber.trim() === '') errors.push('returnNumber is required');
  if (!dto.reason || dto.reason.trim() === '') errors.push('reason is required');
  if (!(dto.returnDate instanceof Date) || isNaN(dto.returnDate.getTime())) errors.push('returnDate must be a valid date');

  if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
    errors.push('Purchase return must contain at least one line');
  } else {
    dto.lines.forEach((line, index) => {
      errors.push(...validateLine(line, index));
    });

    const grLineIds = dto.lines.map(l => l.goodsReceiptLineId);
    if (new Set(grLineIds).size !== grLineIds.length) {
      errors.push('Duplicate goods receipt lines are not allowed within the same return');
    }
  }

  return errors;
};
