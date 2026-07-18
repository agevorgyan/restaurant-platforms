import { CreateGoodsReceiptDto, GoodsReceiptLineDto } from '../dto/goods-receipt.dto';

const validateLine = (line: GoodsReceiptLineDto, index: number): string[] => {
  const errors: string[] = [];
  if (!line.purchaseOrderLineId || line.purchaseOrderLineId.trim() === '') errors.push(`Line [${index}]: purchaseOrderLineId is required`);
  if (!line.ingredientId || line.ingredientId.trim() === '') errors.push(`Line [${index}]: ingredientId is required`);
  if (typeof line.orderedQuantity !== 'number' || line.orderedQuantity <= 0) errors.push(`Line [${index}]: orderedQuantity must be greater than zero`);
  if (typeof line.receivedQuantity !== 'number' || line.receivedQuantity < 0) errors.push(`Line [${index}]: receivedQuantity cannot be negative`);
  if (typeof line.acceptedQuantity !== 'number' || line.acceptedQuantity < 0) errors.push(`Line [${index}]: acceptedQuantity cannot be negative`);
  if (typeof line.rejectedQuantity !== 'number' || line.rejectedQuantity < 0) errors.push(`Line [${index}]: rejectedQuantity cannot be negative`);
  if (line.acceptedQuantity > line.orderedQuantity) errors.push(`Line [${index}]: acceptedQuantity cannot exceed ordered quantity`);
  
  if (line.acceptedQuantity + line.rejectedQuantity !== line.receivedQuantity) {
    errors.push(`Line [${index}]: acceptedQuantity plus rejectedQuantity must equal receivedQuantity`);
  }

  if (!line.unitOfMeasure || line.unitOfMeasure.trim() === '') errors.push(`Line [${index}]: unitOfMeasure is required`);
  
  return errors;
};

export const validateCreateGoodsReceipt = (dto: CreateGoodsReceiptDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId || dto.restaurantId.trim() === '') errors.push('restaurantId is required');
  if (!dto.purchaseOrderId || dto.purchaseOrderId.trim() === '') errors.push('purchaseOrderId is required');
  if (!dto.receiptNumber || dto.receiptNumber.trim() === '') errors.push('receiptNumber is required');
  if (!dto.receivedBy || dto.receivedBy.trim() === '') errors.push('receivedBy is required');
  if (!(dto.receiptDate instanceof Date) || isNaN(dto.receiptDate.getTime())) errors.push('receiptDate must be a valid date');

  if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
    errors.push('Goods receipt must contain at least one line');
  } else {
    dto.lines.forEach((line, index) => {
      errors.push(...validateLine(line, index));
    });

    const poLineIds = dto.lines.map(l => l.purchaseOrderLineId);
    if (new Set(poLineIds).size !== poLineIds.length) {
      errors.push('Duplicate purchase order lines within the same receipt are not allowed');
    }
  }

  return errors;
};
