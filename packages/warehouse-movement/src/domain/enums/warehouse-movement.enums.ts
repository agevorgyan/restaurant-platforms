/**
 * Enterprise Warehouse & Stock Movement Platform - Domain Enums
 *
 * Defines core domain enumerations for stock movement types and movement lifecycle statuses.
 */

export enum MovementType {
  PURCHASE_RECEIPT = 'PURCHASE_RECEIPT',
  TRANSFER = 'TRANSFER',
  RESERVATION = 'RESERVATION',
  RELEASE = 'RELEASE',
  CONSUMPTION = 'CONSUMPTION',
  ADJUSTMENT = 'ADJUSTMENT',
  RETURN = 'RETURN',
}

export enum MovementStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REVERSED = 'REVERSED',
}
