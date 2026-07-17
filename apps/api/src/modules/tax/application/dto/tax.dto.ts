import { TaxTypeEnum } from '../../domain/value-objects/tax-rule.value-object';
import { ServiceChargeType } from '../../domain/value-objects/service-charge.value-object';
import { CalculationModeEnum } from '../../domain/value-objects/tax-calculation-policy.value-object';

export class TaxRuleDto {
  name: string;
  type: TaxTypeEnum;
  percentage: number;
}

export class ServiceChargeDto {
  name: string;
  type: ServiceChargeType;
  value: number;
}

export class CreateTaxPolicyDto {
  restaurantId: string;
  name: string;
  description?: string;
  calculationMode: CalculationModeEnum;
  taxRules: TaxRuleDto[];
  serviceCharges?: ServiceChargeDto[];
  deliveryFee?: number;
  tipPolicyEnabled?: boolean;
  suggestedTipPercentages?: number[];
  priority?: number;
  isDefault?: boolean;
}
