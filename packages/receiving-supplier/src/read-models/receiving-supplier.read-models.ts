/**
 * Enterprise Goods Receiving & Supplier Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Supplier Directory, Supplier Performance Dashboard,
 * Goods Receiving Queue, Receiving History, Inspection Dashboard, and Receiving Statistics.
 */

import { GoodsReceiptStatus, SupplierStatus } from '../domain/enums/receiving-supplier.enums';

export interface SupplierSummaryReadModel {
  supplierId: string;
  supplierCode: string;
  name: string;
  type: string;
  status: SupplierStatus;
  ratingScore: number;
}

export interface SupplierDirectoryReadModel {
  totalSuppliersCount: number;
  suppliers: SupplierSummaryReadModel[];
}

export interface SupplierPerformanceDashboardReadModel {
  supplierId: string;
  supplierName: string;
  onTimeDeliveryRate: number;
  qualityComplianceRate: number;
  totalDeliveriesCount: number;
  ratingScore: number;
}

export interface GoodsReceivingQueueItemReadModel {
  receiptId: string;
  grvNumber: string;
  poNumber: string;
  supplierName: string;
  warehouseId: string;
  status: GoodsReceiptStatus;
  expectedLinesCount: number;
}

export interface GoodsReceivingQueueReadModel {
  pendingReceiptsCount: number;
  queue: GoodsReceivingQueueItemReadModel[];
}

export interface ReceivingHistoryItemReadModel {
  receiptId: string;
  grvNumber: string;
  supplierName: string;
  receivedDate: string;
  totalAcceptedQty: number;
  totalRejectedQty: number;
}

export interface ReceivingHistoryReadModel {
  totalReceiptsCount: number;
  receipts: ReceivingHistoryItemReadModel[];
}

export interface InspectionDashboardReadModel {
  inspectionsCount: number;
  acceptedCount: number;
  rejectedCount: number;
  quarantinedCount: number;
}

export interface ReceivingStatisticsReadModel {
  totalDrafts: number;
  totalReceiving: number;
  totalPartiallyReceived: number;
  totalReceived: number;
  totalRejected: number;
}
