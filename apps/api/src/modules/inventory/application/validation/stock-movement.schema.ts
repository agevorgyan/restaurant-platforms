import { CreateStockMovementDto, UpdateStockMovementDto, StockMovementLineDto } from '../dto/stock-movement.dto';

const validateLine = (line: StockMovementLineDto, index: number): string[] => {
  const errors: string[] = [];
  if (!line.ingredientId) errors.push(`Line [${index}]: ingredientId is required`);
  if (typeof line.quantity !== 'number' || line.quantity <= 0) errors.push(`Line [${index}]: quantity must be greater than zero`);
  if (!line.unitOfMeasure || line.unitOfMeasure.trim() === '') errors.push(`Line [${index}]: unitOfMeasure is required`);
  return errors;
};

export const validateCreateStockMovement = (dto: CreateStockMovementDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.inventoryId) errors.push('inventoryId is required');
  if (!dto.movementNumber || dto.movementNumber.trim() === '') errors.push('movementNumber is required');
  if (!dto.movementType || dto.movementType.trim() === '') errors.push('movementType is required');
  if (!dto.reason || dto.reason.trim() === '') errors.push('reason is required');

  if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
    errors.push('Movement must contain at least one line');
  } else {
    dto.lines.forEach((line, index) => {
      errors.push(...validateLine(line, index));
    });

    const ingredientIds = dto.lines.map(l => l.ingredientId);
    if (new Set(ingredientIds).size !== ingredientIds.length) {
      errors.push('Duplicate ingredients within the same movement are not allowed');
    }
  }

  return errors;
};

export const validateUpdateStockMovement = (dto: UpdateStockMovementDto): string[] => {
  const errors: string[] = [];

  if (dto.reason !== undefined && dto.reason.trim() === '') errors.push('reason cannot be empty');

  if (dto.lines !== undefined) {
    if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
      errors.push('Movement must contain at least one line');
    } else {
      dto.lines.forEach((line, index) => {
        errors.push(...validateLine(line, index));
      });
      const ingredientIds = dto.lines.map(l => l.ingredientId);
      if (new Set(ingredientIds).size !== ingredientIds.length) {
        errors.push('Duplicate ingredients within the same movement are not allowed');
      }
    }
  }

  return errors;
};
