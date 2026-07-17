import { PolicyStatusEnum } from '../../domain/value-objects/payment-policy-shared.value-object';

export class CreatePaymentPolicyDto {
  restaurantId: string;
  name: string;
  allowedPaymentMethods: string[];
  supportedCurrencies: string[];
  limits: {
    minAmount: number;
    maxAmount: number;
  };
  splitPaymentPolicy: {
    allowSplit: boolean;
    maxSplits: number;
  };
  timeoutPolicy: {
    durationSeconds: number;
  };
  retryPolicy: {
    maxAttempts: number;
  };
}

export class UpdatePaymentPolicyStatusDto {
  status: PolicyStatusEnum;
}
