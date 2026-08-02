/**
 * Enterprise Receipt & Fiscal Platform - Domain Enums
 *
 * Defines core domain enumerations for receipt lifecycle statuses and fiscalization statuses.
 */

export enum ReceiptStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  FISCALIZED = 'FISCALIZED',
  PRINTED = 'PRINTED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}

export enum FiscalStatus {
  PENDING = 'PENDING',
  FISCALIZING = 'FISCALIZING',
  FISCALIZED = 'FISCALIZED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED',
  OFFLINE_PENDING = 'OFFLINE_PENDING',
}
