/**
 * Enterprise Goods Receiving & Supplier Platform - Domain Enums
 *
 * Defines core domain enumerations for supplier status and goods receipt statuses.
 */

export enum SupplierStatus {
  ACTIVE = 'ACTIVE',
  PREFERRED = 'PREFERRED',
  BLOCKED = 'BLOCKED',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum GoodsReceiptStatus {
  DRAFT = 'DRAFT',
  RECEIVING = 'RECEIVING',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}
