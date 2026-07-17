import { RefundAmount } from '../value-objects/refund-amount.value-object';
import { RefundReason } from '../value-objects/refund-reason.value-object';
import { RefundStatus } from '../value-objects/refund-status.value-object';

export interface IRefund {
  id: string;
  restaurantId: string;
  paymentId: string;
  transactionId?: string;
  refundReference: string;
  amount: RefundAmount;
  reason: RefundReason;
  status: RefundStatus;
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
