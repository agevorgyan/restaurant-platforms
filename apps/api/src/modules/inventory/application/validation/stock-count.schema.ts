import { CreateStockCountDto, UpdateStockCountDto, StockCountLineDto } from '../dto/stock-count.dto';

const validateLine = (line: StockCountLineDto, index: number): string[] => {
  const errors: string[] = [];
  if (!line.ingredientId) errors.push(`Line [${index}]: ingredientId is required`);
  if (typeof line.expectedQuantity !== 'number' || line.expectedQuantity < 0) errors.push(`Line [${index}]: expectedQuantity cannot be negative`);
  if (typeof line.countedQuantity !== 'number' || line.countedQuantity < 0) errors.push(`Line [${index}]: countedQuantity cannot be negative`);
  if (line.variance !== line.countedQuantity - line.expectedQuantity) {
    errors.push(`Line [${index}]: variance must equal counted quantity minus expected quantity`);
  }
  if (!line.unitOfMeasure || line.unitOfMeasure.trim() === '') errors.push(`Line [${index}]: unitOfMeasure is required`);
  return errors;
};

export const validateCreateStockCount = (dto: CreateStockCountDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.inventoryId) errors.push('inventoryId is required');
  if (!dto.countNumber || dto.countNumber.trim() === '') errors.push('countNumber is required');
  if (!dto.method || dto.method.trim() === '') errors.push('method is required');

  if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
    errors.push('Stock count must contain at least one line');
  } else {
    dto.lines.forEach((line, index) => {
      errors.push(...validateLine(line, index));
    });

    const ingredientIds = dto.lines.map(l => l.ingredientId);
    if (new Set(ingredientIds).size !== ingredientIds.length) {
      errors.push('Duplicate ingredients within the same stock count are not allowed');
    }
  }

  return errors;
};

export const validateUpdateStockCount = (dto: UpdateStockCountDto): string[] => {
  const errors: string[] = [];

  if (dto.lines !== undefined) {
    if (!Array.isArray(dto.lines) || dto.lines.length === 0) {
      errors.push('Stock count must contain at least one line');
    } else {
      dto.lines.forEach((line, index) => {
        errors.push(...validateLine(line, index));
      });
      const ingredientIds = dto.lines.map(l => l.ingredientId);
      if (new Set(ingredientIds).size !== ingredientIds.length) {
        errors.push('Duplicate ingredients within the same stock count are not allowed');
      }
    }
  }

  return errors;
};
