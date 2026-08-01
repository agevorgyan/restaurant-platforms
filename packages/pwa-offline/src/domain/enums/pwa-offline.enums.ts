/**
 * Enterprise Offline & PWA Platform - Domain Enums
 *
 * Defines core domain enumerations for connectivity status and background synchronization state lifecycle.
 */

export enum ConnectivityStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DEGRADED = 'DEGRADED',
  RECONNECTING = 'RECONNECTING',
}

export enum SyncStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CONFLICT = 'CONFLICT',
}
