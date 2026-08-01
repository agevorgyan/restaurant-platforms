/**
 * Enterprise Mobile Offline & Synchronization Platform - Domain Enums
 *
 * Defines core domain enumerations for connectivity status and synchronization lifecycle states.
 */

export enum ConnectivityStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  LIMITED = 'LIMITED',
  RECONNECTING = 'RECONNECTING',
}

export enum SyncStatus {
  IDLE = 'IDLE',
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CONFLICT = 'CONFLICT',
}
