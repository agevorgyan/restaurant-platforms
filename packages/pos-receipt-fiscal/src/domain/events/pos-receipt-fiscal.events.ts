/**
 * Enterprise Receipt & Fiscal Platform - Domain Events
 *
 * Domain events emitted during receipt generation, fiscalization, printing, digital delivery, reprints, and fiscal failures.
 */

import { FiscalStatus, ReceiptStatus } from '../enums/pos-receipt-fiscal.enums';

export interface ReceiptGeneratedEvent {
  eventName: 'ReceiptGenerated';
  receiptId: string;
  receiptNumber: string;
  orderId: string;
  timestamp: Date;
}

export interface ReceiptFiscalizedEvent {
  eventName: 'ReceiptFiscalized';
  receiptId: string;
  fiscalReceiptNumber: string;
  fiscalSignature: string;
  providerId: string;
  timestamp: Date;
}

export interface ReceiptPrintedEvent {
  eventName: 'ReceiptPrinted';
  receiptId: string;
  printerId: string;
  timestamp: Date;
}

export interface ReceiptDeliveredEvent {
  eventName: 'ReceiptDelivered';
  receiptId: string;
  channel: 'EMAIL' | 'SMS' | 'QR';
  destination: string;
  timestamp: Date;
}

export interface ReceiptReprintedEvent {
  eventName: 'ReceiptReprinted';
  receiptId: string;
  reprintReason: string;
  timestamp: Date;
}

export interface FiscalizationFailedEvent {
  eventName: 'FiscalizationFailed';
  receiptId: string;
  errorCode: string;
  errorMessage: string;
  timestamp: Date;
}

export interface CorrectionIssuedEvent {
  eventName: 'CorrectionIssued';
  originalReceiptId: string;
  correctionReceiptId: string;
  timestamp: Date;
}

export interface ReturnReceiptGeneratedEvent {
  eventName: 'ReturnReceiptGenerated';
  originalReceiptId: string;
  returnReceiptId: string;
  timestamp: Date;
}

export type PosReceiptFiscalDomainEvent =
  | ReceiptGeneratedEvent
  | ReceiptFiscalizedEvent
  | ReceiptPrintedEvent
  | ReceiptDeliveredEvent
  | ReceiptReprintedEvent
  | FiscalizationFailedEvent
  | CorrectionIssuedEvent
  | ReturnReceiptGeneratedEvent;
