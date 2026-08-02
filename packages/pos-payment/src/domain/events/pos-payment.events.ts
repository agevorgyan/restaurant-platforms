/**
 * Enterprise POS Payment Platform - Domain Events
 *
 * Domain events emitted during payment initialization, authorization, capture, void/refund processing, and tip additions.
 */

import { PaymentStatus, TenderType } from '../enums/pos-payment.enums';

export interface PaymentInitiatedEvent {
  eventName: 'PaymentInitiated';
  paymentId: string;
  orderId: string;
  totalAmount: number;
  timestamp: Date;
}

export interface PaymentAuthorizedEvent {
  eventName: 'PaymentAuthorized';
  paymentId: string;
  authCode: string;
  tokenizedRef: string;
  authorizedAmount: number;
  timestamp: Date;
}

export interface PaymentCapturedEvent {
  eventName: 'PaymentCaptured';
  paymentId: string;
  capturedAmount: number;
  timestamp: Date;
}

export interface PaymentCompletedEvent {
  eventName: 'PaymentCompleted';
  paymentId: string;
  orderId: string;
  tenders: Array<{ tenderType: TenderType; amount: number }>;
  timestamp: Date;
}

export interface PaymentVoidedEvent {
  eventName: 'PaymentVoided';
  paymentId: string;
  reason: string;
  timestamp: Date;
}

export interface PaymentRefundedEvent {
  eventName: 'PaymentRefunded';
  paymentId: string;
  refundAmount: number;
  reason: string;
  timestamp: Date;
}

export interface PaymentFailedEvent {
  eventName: 'PaymentFailed';
  paymentId: string;
  errorCode: string;
  errorMessage: string;
  timestamp: Date;
}

export interface TipAddedEvent {
  eventName: 'TipAdded';
  paymentId: string;
  tipAmount: number;
  timestamp: Date;
}

export type PosPaymentDomainEvent =
  | PaymentInitiatedEvent
  | PaymentAuthorizedEvent
  | PaymentCapturedEvent
  | PaymentCompletedEvent
  | PaymentVoidedEvent
  | PaymentRefundedEvent
  | PaymentFailedEvent
  | TipAddedEvent;
