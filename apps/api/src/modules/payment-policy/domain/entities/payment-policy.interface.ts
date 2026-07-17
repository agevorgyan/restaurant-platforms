import { PaymentLimits } from '../value-objects/payment-limits.value-object';
import { SplitPaymentPolicy } from '../value-objects/split-payment-policy.value-object';
import { PaymentTimeoutPolicy, PaymentRetryPolicy, CurrencyPolicy, PolicyStatus } from '../value-objects/payment-policy-shared.value-object';

export interface IPaymentPolicy {
  id: string;
  restaurantId: string;
  name: string;
  status: PolicyStatus;
  allowedPaymentMethods: string[];
  supportedCurrencies: CurrencyPolicy;
  limits: PaymentLimits;
  splitPaymentPolicy: SplitPaymentPolicy;
  timeoutPolicy: PaymentTimeoutPolicy;
  retryPolicy: PaymentRetryPolicy;
  createdAt: Date;
  updatedAt: Date;
}
