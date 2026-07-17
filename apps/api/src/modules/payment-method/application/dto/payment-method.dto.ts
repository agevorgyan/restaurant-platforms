import { PaymentProviderType } from '../../domain/value-objects/payment-method-configuration.value-object';
import { PaymentMethodStatus } from '../../domain/value-objects/payment-method-availability.value-object';

export class CreatePaymentMethodDto {
  restaurantId: string;
  name: string;
  provider: PaymentProviderType;
  paymentType: string;
  displayOrder: number;
  isDefault: boolean;
  supportedCurrencies: string[];
  supportedOrderTypes: string[];
  configurationSettings: Record<string, any>;
}

export class UpdatePaymentMethodStatusDto {
  status: PaymentMethodStatus;
}
