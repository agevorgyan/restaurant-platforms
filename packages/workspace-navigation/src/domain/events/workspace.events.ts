/**
 * Enterprise Workspace & Navigation Platform - Domain Events
 *
 * Domain events emitted during workspace loading, navigation transitions,
 * favorite pinning, command execution, and search execution.
 */

export interface WorkspaceLoadedEvent {
  eventName: 'WorkspaceLoaded';
  workspaceId: string;
  timestamp: Date;
}

export interface NavigationChangedEvent {
  eventName: 'NavigationChanged';
  fromPath: string;
  toPath: string;
  timestamp: Date;
}

export interface WorkspaceSwitchedEvent {
  eventName: 'WorkspaceSwitched';
  previousWorkspaceId: string;
  targetWorkspaceId: string;
  timestamp: Date;
}

export interface FavoriteAddedEvent {
  eventName: 'FavoriteAdded';
  favoriteId: string;
  title: string;
  path: string;
  timestamp: Date;
}

export interface FavoriteRemovedEvent {
  eventName: 'FavoriteRemoved';
  favoriteId: string;
  timestamp: Date;
}

export interface RecentItemRecordedEvent {
  eventName: 'RecentItemRecorded';
  itemId: string;
  title: string;
  path: string;
  timestamp: Date;
}

export interface CommandExecutedEvent {
  eventName: 'CommandExecuted';
  commandId: string;
  commandName: string;
  timestamp: Date;
}

export interface SearchExecutedEvent {
  eventName: 'SearchExecuted';
  query: string;
  resultsCount: number;
  timestamp: Date;
}

export type WorkspaceDomainEvent =
  | WorkspaceLoadedEvent
  | NavigationChangedEvent
  | WorkspaceSwitchedEvent
  | FavoriteAddedEvent
  | FavoriteRemovedEvent
  | RecentItemRecordedEvent
  | CommandExecutedEvent
  | SearchExecutedEvent;
