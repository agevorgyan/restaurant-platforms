/**
 * Enterprise Receipt & Fiscal Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Receipt History, Fiscal Transactions, Reprint History,
 * Digital Deliveries, Fiscal Errors, and Receipt Statistics.
 */

import { FiscalStatus, ReceiptStatus } from '../domain/enums/pos-receipt-fiscal.enums';

export interface ReceiptSummaryReadModel {
  receiptId: string;
  receiptNumber: string;
  orderId: string;
  grandTotal: number;
  status: ReceiptStatus;
  fiscalStatus: FiscalStatus;
  fiscalReceiptNumber?: string;
  createdAt: string;
}

export interface ReceiptHistoryReadModel {
  totalReceipts: number;
  receipts: ReceiptSummaryReadModel[];
}

export interface FiscalTransactionEntryReadModel {
  fiscalTxId: string;
  receiptId: string;
  providerName: string;
  fiscalReceiptNumber: string;
  signatureHash: string;
  fiscalizedAt: string;
}

export interface FiscalTransactionsReadModel {
  totalFiscalizedCount: number;
  transactions: FiscalTransactionEntryReadModel[];
}

export interface ReprintHistoryEntryReadModel {
  receiptId: string;
  reprintedBy: string;
  reason: string;
  reprintedAt: string;
}

export interface ReprintHistoryReadModel {
  totalReprintsCount: number;
  history: ReprintHistoryEntryReadModel[];
}

export interface DigitalDeliveryEntryReadModel {
  receiptId: string;
  channel: 'EMAIL' | 'SMS' | 'QR';
  destination: string;
  sentAt: string;
}

export interface DigitalDeliveriesReadModel {
  totalDigitalDeliveries: number;
  deliveries: DigitalDeliveryEntryReadModel[];
}

export interface FiscalErrorEntryReadModel {
  receiptId: string;
  errorCode: string;
  errorMessage: string;
  occurredAt: string;
}

export interface FiscalErrorsReadModel {
  totalErrorsCount: number;
  errors: FiscalErrorEntryReadModel[];
}

export interface ReceiptStatisticsReadModel {
  totalGenerated: number;
  totalFiscalized: number;
  totalDigitalSent: number;
  fiscalSuccessRatePercentage: number;
}
