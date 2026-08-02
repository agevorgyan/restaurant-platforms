/**
 * Enterprise Procurement & Purchase Order Platform - Domain Events
 *
 * Domain events emitted during purchase requisition creation, order creation, submission, approval, issuance, cancellation, and escalation.
 */

import { ApprovalStatus, PurchaseOrderStatus } from '../enums/procurement-po.enums';

export interface PurchaseRequisitionCreatedEvent {
  eventName: 'PurchaseRequisitionCreated';
  requisitionId: string;
  requesterId: string;
  itemsCount: number;
  timestamp: Date;
}

export interface PurchaseOrderCreatedEvent {
  eventName: 'PurchaseOrderCreated';
  poId: string;
  poNumber: string;
  totalAmount: number;
  timestamp: Date;
}

export interface PurchaseOrderSubmittedEvent {
  eventName: 'PurchaseOrderSubmitted';
  poId: string;
  poNumber: string;
  requiresApproval: boolean;
  timestamp: Date;
}

export interface PurchaseOrderApprovedEvent {
  eventName: 'PurchaseOrderApproved';
  poId: string;
  poNumber: string;
  approvedBy: string;
  timestamp: Date;
}

export interface PurchaseOrderIssuedEvent {
  eventName: 'PurchaseOrderIssued';
  poId: string;
  poNumber: string;
  issuedToVendor: string;
  timestamp: Date;
}

export interface PurchaseOrderCancelledEvent {
  eventName: 'PurchaseOrderCancelled';
  poId: string;
  reason: string;
  timestamp: Date;
}

export interface ApprovalEscalatedEvent {
  eventName: 'ApprovalEscalated';
  poId: string;
  currentLevel: number;
  nextLevel: number;
  timestamp: Date;
}

export type ProcurementPoDomainEvent =
  | PurchaseRequisitionCreatedEvent
  | PurchaseOrderCreatedEvent
  | PurchaseOrderSubmittedEvent
  | PurchaseOrderApprovedEvent
  | PurchaseOrderIssuedEvent
  | PurchaseOrderCancelledEvent
  | ApprovalEscalatedEvent;
