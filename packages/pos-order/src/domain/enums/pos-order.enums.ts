/**
 * Enterprise POS Order Entry Platform - Domain Enums
 *
 * Defines core domain enumerations for POS order statuses and line item statuses.
 */

export enum OrderStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  VOIDED = 'VOIDED',
}

export enum LineStatus {
  NORMAL = 'NORMAL',
  MODIFIED = 'MODIFIED',
  DISCOUNTED = 'DISCOUNTED',
  VOIDED = 'VOIDED',
}
