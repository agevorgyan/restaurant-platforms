/**
 * Enterprise Kitchen Routing & Production Platform - Domain Enums
 *
 * Defines core domain enumerations for kitchen ticket lifecycle statuses and production station statuses.
 */

export enum KitchenTicketStatus {
  QUEUED = 'QUEUED',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum StationStatus {
  IDLE = 'IDLE',
  BUSY = 'BUSY',
  BLOCKED = 'BLOCKED',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
}
