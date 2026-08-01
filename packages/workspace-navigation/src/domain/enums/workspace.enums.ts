/**
 * Enterprise Workspace & Navigation Platform - Domain Enums
 *
 * Defines core domain enumerations for workspace status and navigation UI layout states.
 */

export enum WorkspaceStatus {
  LOADING = 'LOADING',
  READY = 'READY',
  UPDATING = 'UPDATING',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
}

export enum NavigationState {
  EXPANDED = 'EXPANDED',
  COLLAPSED = 'COLLAPSED',
  HIDDEN = 'HIDDEN',
  PINNED = 'PINNED',
  FLOATING = 'FLOATING',
}
