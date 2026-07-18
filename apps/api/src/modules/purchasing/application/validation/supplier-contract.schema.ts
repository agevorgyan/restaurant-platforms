import { CreateSupplierContractDto } from '../dto/supplier-contract.dto';

export const validateCreateSupplierContract = (dto: CreateSupplierContractDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId || dto.restaurantId.trim() === '') errors.push('restaurantId is required');
  if (!dto.supplierId || dto.supplierId.trim() === '') errors.push('supplierId is required');
  if (!dto.contractNumber || dto.contractNumber.trim() === '') errors.push('contractNumber is required');
  if (!(dto.effectiveStartDate instanceof Date) || isNaN(dto.effectiveStartDate.getTime())) errors.push('effectiveStartDate must be a valid date');
  if (!(dto.effectiveEndDate instanceof Date) || isNaN(dto.effectiveEndDate.getTime())) errors.push('effectiveEndDate must be a valid date');
  
  if (dto.effectiveStartDate && dto.effectiveEndDate && dto.effectiveStartDate >= dto.effectiveEndDate) {
    errors.push('effectiveStartDate must be before effectiveEndDate');
  }

  if (!dto.currency || dto.currency.trim() === '') errors.push('currency is required');
  if (typeof dto.leadTimeDays !== 'number' || dto.leadTimeDays < 0) errors.push('leadTimeDays must be non-negative');
  if (typeof dto.minimumOrderQuantity !== 'number' || dto.minimumOrderQuantity <= 0) errors.push('minimumOrderQuantity must be greater than zero');

  if (!Array.isArray(dto.lines)) {
    errors.push('Contract must contain an array of lines');
  } else {
    dto.lines.forEach((line, index) => {
      if (!line.ingredientId || line.ingredientId.trim() === '') {
        errors.push(`Line [${index}]: ingredientId is required`);
      }
    });
  }

  return errors;
};
