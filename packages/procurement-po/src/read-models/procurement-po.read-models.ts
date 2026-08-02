/**
 * Enterprise Procurement & Purchase Order Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Purchase Order Dashboard, Approval Queue, Open Orders,
 * Procurement Statistics, and Delivery Schedule.
 */

import { ApprovalStatus, PurchaseOrderStatus } from '../domain/enums/procurement-po.enums';

export interface PurchaseOrderItemReadModel {
  poId: string;
  poNumber: string;
  vendorId: string;
  totalAmount: number;
  linesCount: number;
  status: PurchaseOrderStatus;
  requiresApproval: boolean;
  approvalStatus: ApprovalStatus;
  expectedDeliveryDate: string;
  createdDate: string;
}

export interface PurchaseOrderDashboardReadModel {
  totalOrdersCount: number;
  totalProcurementSpend: number;
  orders: PurchaseOrderItemReadModel[];
}

export interface ApprovalQueueItemReadModel {
  poId: string;
  poNumber: string;
  totalAmount: number;
  requiredApprovalLevel: number;
  submittedBy: string;
  submittedAt: string;
}

export interface ApprovalQueueReadModel {
  pendingApprovalsCount: number;
  queue: ApprovalQueueItemReadModel[];
}

export interface OpenOrdersReadModel {
  openOrdersCount: number;
  orders: PurchaseOrderItemReadModel[];
}

export interface ProcurementStatisticsReadModel {
  totalDrafts: number;
  totalPendingApproval: number;
  totalApproved: number;
  totalIssued: number;
  totalCompleted: number;
  totalCancelled: number;
}

export interface DeliveryScheduleItemReadModel {
  poId: string;
  poNumber: string;
  expectedDeliveryDate: string;
  vendorName: string;
  itemsSummary: string;
}

export interface DeliveryScheduleReadModel {
  scheduledDeliveriesCount: number;
  deliveries: DeliveryScheduleItemReadModel[];
}
