import { CreateTaxPolicyDto } from '../dto/tax.dto';

export const validateCreateTaxPolicy = (dto: CreateTaxPolicyDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.calculationMode) errors.push('calculationMode is required');
  if (!dto.taxRules || dto.taxRules.length === 0) errors.push('At least one tax rule is required');

  // Business Rule: Tax rule names must be unique within a policy
  if (dto.taxRules) {
    const names = new Set();
    for (const rule of dto.taxRules) {
      if (names.has(rule.name)) {
        errors.push(`Tax rule name '${rule.name}' is duplicated`);
      }
      names.add(rule.name);
    }
  }
  
  return errors;
};
