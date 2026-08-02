/**
 * Enterprise POS Payment Platform - Domain Enums
 *
 * Defines core domain enumerations for payment lifecycle statuses and tender types.
 */

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  VOIDED = 'VOIDED',
  FAILED = 'FAILED',
}

export enum TenderType {
  CASH = 'CASH',
  CARD = 'CARD',
  VOUCHER = 'VOUCHER',
  GIFT_CARD = 'GIFT_CARD',
  WALLET = 'WALLET',
  HOUSE_ACCOUNT = 'HOUSE_ACCOUNT',
}
