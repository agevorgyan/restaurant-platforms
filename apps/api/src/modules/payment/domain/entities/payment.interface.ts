import { PaymentAmount } from '../value-objects/payment-amount.value-object';
import { PaymentStatus } from '../value-objects/payment-status.value-object';
import { PaymentType } from '../value-objects/payment-type.value-object';
import { PaymentReference } from '../value-objects/payment-reference.value-object';

export interface IPayment {
  id: string;
  restaurantId: string;
  orderId: string;
  paymentReference: PaymentReference;
  paymentType: PaymentType;
  status: PaymentStatus;
  amount: PaymentAmount;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
