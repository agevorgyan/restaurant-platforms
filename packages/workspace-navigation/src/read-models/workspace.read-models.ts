/**
 * Enterprise Workspace & Navigation Platform - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Workspace Catalog, Navigation Catalog, Favorite Catalog,
 * Recent History, Command History, Search History, and Notification Overview.
 */

import { NavigationState, WorkspaceStatus } from '../domain/enums/workspace.enums';

export interface WorkspaceSummaryReadModel {
  workspaceId: string;
  workspaceType: string;
  status: WorkspaceStatus;
  navigationState: NavigationState;
  activePath: string;
}

export interface WorkspaceCatalogReadModel {
  totalWorkspaces: number;
  workspaces: WorkspaceSummaryReadModel[];
}

export interface NavigationCatalogReadModel {
  activeWorkspaceId: string;
  totalNavigationItems: number;
  items: Array<{
    id: string;
    label: string;
    path: string;
    icon?: string;
    childrenCount: number;
  }>;
}

export interface FavoriteCatalogReadModel {
  totalFavorites: number;
  favorites: Array<{
    id: string;
    title: string;
    path: string;
    icon?: string;
  }>;
}

export interface RecentHistoryReadModel {
  totalRecentItems: number;
  recentItems: Array<{
    id: string;
    title: string;
    path: string;
    visitedAt: string;
  }>;
}

export interface CommandHistoryReadModel {
  totalRegisteredCommands: number;
  commands: Array<{
    commandId: string;
    title: string;
    category: string;
    shortcut?: string;
  }>;
}

export interface SearchHistoryReadModel {
  totalRecentSearches: number;
  recentQueries: string[];
}

export interface NotificationOverviewReadModel {
  unreadCount: number;
  hasUnreadHighPriority: boolean;
  recentNotifications: Array<{
    id: string;
    title: string;
    message: string;
    createdAt: string;
  }>;
}
