/**
 * Enterprise Waitlist & Seating Platform - Domain Enums
 *
 * Defines core domain enumerations for waitlist queue statuses and seating optimization strategies.
 */

export enum WaitlistStatus {
  WAITING = 'WAITING',
  NOTIFIED = 'NOTIFIED',
  READY_TO_SEAT = 'READY_TO_SEAT',
  SEATED = 'SEATED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  NO_SHOW = 'NO_SHOW',
}

export enum SeatingStrategy {
  FIFO = 'FIFO',
  PRIORITY = 'PRIORITY',
  CAPACITY_OPTIMIZED = 'CAPACITY_OPTIMIZED',
  BALANCED = 'BALANCED',
  MANUAL = 'MANUAL',
}
