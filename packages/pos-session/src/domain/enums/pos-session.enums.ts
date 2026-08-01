/**
 * Enterprise POS Session & Shift Management Platform - Domain Enums
 *
 * Defines core domain enumerations for cashier shift statuses and cash movement types.
 */

export enum SessionStatus {
  OPENING = 'OPENING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
  RECOVERED = 'RECOVERED',
}

export enum CashMovementType {
  OPENING_FLOAT = 'OPENING_FLOAT',
  SALE = 'SALE',
  REFUND = 'REFUND',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  SAFE_DROP = 'SAFE_DROP',
  CLOSING_COUNT = 'CLOSING_COUNT',
}
