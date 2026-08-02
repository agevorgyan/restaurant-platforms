/**
 * Enterprise Guest Service Workflow Platform - Domain Enums
 *
 * Defines core domain enumerations for guest visit statuses and service request statuses.
 */

export enum VisitStatus {
  ARRIVED = 'ARRIVED',
  CHECKED_IN = 'CHECKED_IN',
  SEATED = 'SEATED',
  ORDERING = 'ORDERING',
  DINING = 'DINING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
