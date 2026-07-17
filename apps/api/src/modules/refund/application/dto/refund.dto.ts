import { RefundReasonEnum } from '../../domain/value-objects/refund-reason.value-object';

export class CreateRefundDto {
  restaurantId: string;
  paymentId: string;
  refundReference: string;
  amount: number; // minor units
  currency: string;
  reason: RefundReasonEnum;
  reasonDetails?: string;
  requestedBy: string;
  metadata?: Record<string, any>;
}

export class ApproveRefundDto {
  approvedBy: string;
}

export class CompleteRefundDto {
  transactionId: string;
}
