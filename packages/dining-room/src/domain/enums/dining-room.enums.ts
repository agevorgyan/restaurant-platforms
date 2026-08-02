/**
 * Enterprise Dining Room & Floor Management Platform - Domain Enums
 *
 * Defines core domain enumerations for table lifecycle statuses and area statuses.
 */

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING',
  BLOCKED = 'BLOCKED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export enum AreaStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  MAINTENANCE = 'MAINTENANCE',
}
