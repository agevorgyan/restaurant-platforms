/**
 * Enterprise Reservation Management Platform - Domain Enums
 *
 * Defines core domain enumerations for reservation lifecycle statuses and booking sources/channels.
 */

export enum ReservationStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  PENDING_DEPOSIT = 'PENDING_DEPOSIT',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  EXPIRED = 'EXPIRED',
}

export enum ReservationSource {
  WEBSITE = 'WEBSITE',
  MOBILE_APP = 'MOBILE_APP',
  PHONE = 'PHONE',
  WALK_IN = 'WALK_IN',
  GOOGLE = 'GOOGLE',
  PARTNER = 'PARTNER',
}
