import { PaymentMethodConfiguration, PaymentProviderType } from '../value-objects/payment-method-configuration.value-object';
import { PaymentMethodAvailability, PaymentMethodStatus } from '../value-objects/payment-method-availability.value-object';

export interface IPaymentMethod {
  id: string;
  restaurantId: string;
  name: string;
  provider: PaymentProviderType;
  paymentType: string;
  status: PaymentMethodStatus;
  displayOrder: number;
  isDefault: boolean;
  supportedCurrencies: string[];
  supportedOrderTypes: string[];
  configuration: PaymentMethodConfiguration;
  availability: PaymentMethodAvailability;
  createdAt: Date;
  updatedAt: Date;
}
