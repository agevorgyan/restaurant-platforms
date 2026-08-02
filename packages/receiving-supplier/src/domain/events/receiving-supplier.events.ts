/**
 * Enterprise Goods Receiving & Supplier Platform - Domain Events
 *
 * Domain events emitted during supplier creation, archiving, goods receiving, partial receipts, inspection completion, and rating updates.
 */

import { GoodsReceiptStatus, SupplierStatus } from '../enums/receiving-supplier.enums';

export interface SupplierCreatedEvent {
  eventName: 'SupplierCreated';
  supplierId: string;
  supplierCode: string;
  name: string;
  timestamp: Date;
}

export interface SupplierArchivedEvent {
  eventName: 'SupplierArchived';
  supplierId: string;
  reason: string;
  timestamp: Date;
}

export interface GoodsReceiptCreatedEvent {
  eventName: 'GoodsReceiptCreated';
  receiptId: string;
  receiptNumber: string;
  poNumber: string;
  supplierId: string;
  timestamp: Date;
}

export interface GoodsReceivedEvent {
  eventName: 'GoodsReceived';
  receiptId: string;
  receiptNumber: string;
  poNumber: string;
  warehouseId: string;
  receivedItems: Array<{ stockItemId: string; quantity: number; batchRef: string }>;
  timestamp: Date;
}

export interface PartialReceiptRecordedEvent {
  eventName: 'PartialReceiptRecorded';
  receiptId: string;
  receivedQuantity: number;
  remainingQuantity: number;
  timestamp: Date;
}

export interface InspectionCompletedEvent {
  eventName: 'InspectionCompleted';
  receiptId: string;
  inspectionResult: 'ACCEPTED' | 'ACCEPTED_WITH_REMARKS' | 'REJECTED' | 'QUARANTINED';
  acceptedQty: number;
  rejectedQty: number;
  timestamp: Date;
}

export interface ReceiptRejectedEvent {
  eventName: 'ReceiptRejected';
  receiptId: string;
  reason: string;
  timestamp: Date;
}

export interface SupplierPerformanceUpdatedEvent {
  eventName: 'SupplierPerformanceUpdated';
  supplierId: string;
  newRatingScore: number;
  timestamp: Date;
}

export type ReceivingSupplierDomainEvent =
  | SupplierCreatedEvent
  | SupplierArchivedEvent
  | GoodsReceiptCreatedEvent
  | GoodsReceivedEvent
  | PartialReceiptRecordedEvent
  | InspectionCompletedEvent
  | ReceiptRejectedEvent
  | SupplierPerformanceUpdatedEvent;
