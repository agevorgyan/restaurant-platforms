import { TaxRule } from '../value-objects/tax-rule.value-object';
import { ServiceCharge } from '../value-objects/service-charge.value-object';
import { DeliveryFee } from '../value-objects/delivery-fee.value-object';
import { TipPolicy } from '../value-objects/tip-policy.value-object';
import { TaxCalculationPolicy } from '../value-objects/tax-calculation-policy.value-object';
import { TaxStatus } from '../value-objects/tax-status.value-object';

export interface ITaxPolicy {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  status: TaxStatus;
  calculationMode: TaxCalculationPolicy;
  taxRules: TaxRule[];
  serviceCharges: ServiceCharge[];
  deliveryFee: DeliveryFee;
  tipPolicy: TipPolicy;
  priority: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
