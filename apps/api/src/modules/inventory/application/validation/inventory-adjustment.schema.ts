import { CreateInventoryAdjustmentDto, UpdateInventoryAdjustmentDto, InventoryAdjustmentLineDto } from '../dto/inventory-adjustment.dto';

const validateLine = (line: InventoryAdjustmentLineDto, index: number): string[] => {
  const errors: string[] = [];
  if (!line.ingredientId) errors.push(`Line [${index}]: ingredientId is required`);
  if (typeof line.expectedQuantity !== 'number' || line.expectedQuantity < 0) errors.push(`Line [${index}]: expectedQuantity cannot be negative`);
  if (typeof line.actualQuantity !== 'number' || line.actualQuantity < 0) errors.push(`Line [${index}]: actualQuantity cannot be negative`);
  if (line.differenceQuantity !== line.actualQuantity - line.expectedQuantity) {
    errors.push(`Line [${index}]: differenceQuantity must equal actualQuantity minus expectedQuantity`);
  }
  if (!line.unitOfMeasure || line.unitOfMeasure.trim() === '') errors.push(`Line [${index}]: unitOfMeasure is required`);
  return errors;
};

export const validateCreateInventoryAdjustment = (dto: CreateInventoryAdjustmentDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.inventoryId) errors.push('inventoryId is required');
  if (!dto.adjustmentNumber || dto.adjustmentNumber.trim() === '') errors.push('adjustmentNumber is required');
  if (!dto.adjustmentType || dto.adjustmentType.trim() === '') errors.push('adjustmentType is required');
  if (!dto.reason || dto.reason.trim() === '') errors.push('reason is required');
  if (!dto.approvalStatus || dto.approvalStatus.trim() === '') errors.push('approvalStatus is required');

  if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
    errors.push('Adjustment must contain at least one line');
  } else {
    dto.lines.forEach((line, index) => {
      errors.push(...validateLine(line, index));
    });

    const ingredientIds = dto.lines.map(l => l.ingredientId);
    if (new Set(ingredientIds).size !== ingredientIds.length) {
      errors.push('Duplicate ingredients within the same adjustment are not allowed');
    }
  }

  return errors;
};

export const validateUpdateInventoryAdjustment = (dto: UpdateInventoryAdjustmentDto): string[] => {
  const errors: string[] = [];

  if (dto.reason !== undefined && dto.reason.trim() === '') errors.push('reason cannot be empty');

  if (dto.lines !== undefined) {
    if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
      errors.push('Adjustment must contain at least one line');
    } else {
      dto.lines.forEach((line, index) => {
        errors.push(...validateLine(line, index));
      });
      const ingredientIds = dto.lines.map(l => l.ingredientId);
      if (new Set(ingredientIds).size !== ingredientIds.length) {
        errors.push('Duplicate ingredients within the same adjustment are not allowed');
      }
    }
  }

  return errors;
};
