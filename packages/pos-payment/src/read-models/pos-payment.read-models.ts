/**
 * Enterprise POS Payment Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Payment Summary, Tender Breakdown, Refund History,
 * Tip Statistics, and Payment Audit Trail.
 */

import { PaymentStatus, TenderType } from '../domain/enums/pos-payment.enums';

export interface PaymentSummaryReadModel {
  paymentId: string;
  orderId: string;
  totalAmount: number;
  paidAmount: number;
  tipAmount: number;
  status: PaymentStatus;
  createdAt: string;
}

export interface TenderItemReadModel {
  tenderId: string;
  tenderType: TenderType;
  amount: number;
  tokenizedRef?: string;
  authCode?: string;
}

export interface TenderBreakdownReadModel {
  paymentId: string;
  totalOrderAmount: number;
  remainingBalance: number;
  tenders: TenderItemReadModel[];
}

export interface RefundHistoryEntryReadModel {
  refundId: string;
  paymentId: string;
  refundAmount: number;
  reason: string;
  processedAt: string;
}

export interface RefundHistoryReadModel {
  totalRefundsCount: number;
  totalRefundedAmount: number;
  history: RefundHistoryEntryReadModel[];
}

export interface TipStatisticsReadModel {
  totalTipsCollected: number;
  totalGratuityCollected: number;
  averageTipPercentage: number;
}

export interface PaymentAuditEntryReadModel {
  auditId: string;
  paymentId: string;
  action: string;
  tokenizedRef?: string;
  timestamp: string;
}

export interface PaymentAuditReadModel {
  paymentId: string;
  events: PaymentAuditEntryReadModel[];
}
