/**
 * Enterprise Inventory Control Platform - Domain Enums
 *
 * Defines core domain enumerations for stock count statuses and waste statuses.
 */

export enum CountStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export enum WasteStatus {
  RECORDED = 'RECORDED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}
