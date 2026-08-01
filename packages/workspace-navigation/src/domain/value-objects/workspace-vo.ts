/**
 * Enterprise Workspace & Navigation Platform - Value Objects
 *
 * Immutable Value Objects encapsulating workspace IDs, workspace contexts, metadata navigation items,
 * dynamic breadcrumbs, favorite items, recent items, command definitions, search queries/results, and notification badges.
 */

import { NavigationState, WorkspaceStatus } from '../enums/workspace.enums';

/**
 * WorkspaceId Value Object
 */
export class WorkspaceId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('WorkspaceId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): WorkspaceId {
    return new WorkspaceId(id || `ws-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * NavigationItem Value Object
 */
export class NavigationItem {
  public readonly id: string;
  public readonly label: string;
  public readonly path: string;
  public readonly icon?: string;
  public readonly requiredPermissions: string[];
  public readonly badgeCount?: number;
  public readonly children: NavigationItem[];

  private constructor(props: {
    id: string;
    label: string;
    path: string;
    icon?: string;
    requiredPermissions?: string[];
    badgeCount?: number;
    children?: NavigationItem[];
  }) {
    this.id = props.id;
    this.label = props.label;
    this.path = props.path;
    this.icon = props.icon;
    this.requiredPermissions = props.requiredPermissions || [];
    this.badgeCount = props.badgeCount;
    this.children = props.children || [];
  }

  public static create(props: {
    id: string;
    label: string;
    path: string;
    icon?: string;
    requiredPermissions?: string[];
    badgeCount?: number;
    children?: NavigationItem[];
  }): NavigationItem {
    return new NavigationItem(props);
  }
}

/**
 * NavigationTree Value Object
 */
export class NavigationTree {
  public readonly rootItems: NavigationItem[];

  private constructor(items: NavigationItem[]) {
    this.rootItems = items;
  }

  public static create(items: NavigationItem[]): NavigationTree {
    return new NavigationTree(items);
  }
}

/**
 * Breadcrumb Value Object
 */
export class Breadcrumb {
  public readonly label: string;
  public readonly path?: string;
  public readonly isLast: boolean;

  private constructor(label: string, path?: string, isLast: boolean = false) {
    this.label = label;
    this.path = path;
    this.isLast = isLast;
  }

  public static create(label: string, path?: string, isLast?: boolean): Breadcrumb {
    return new Breadcrumb(label, path, isLast);
  }
}

/**
 * FavoriteItem Value Object
 */
export class FavoriteItem {
  public readonly id: string;
  public readonly title: string;
  public readonly path: string;
  public readonly icon?: string;

  private constructor(id: string, title: string, path: string, icon?: string) {
    this.id = id;
    this.title = title;
    this.path = path;
    this.icon = icon;
  }

  public static create(title: string, path: string, icon?: string): FavoriteItem {
    const id = `fav-${path.replace(/[^a-zA-Z0-9]/g, '-')}`;
    return new FavoriteItem(id, title, path, icon);
  }
}

/**
 * RecentItem Value Object
 */
export class RecentItem {
  public readonly id: string;
  public readonly title: string;
  public readonly path: string;
  public readonly visitedAt: Date;

  private constructor(id: string, title: string, path: string, visitedAt: Date) {
    this.id = id;
    this.title = title;
    this.path = path;
    this.visitedAt = visitedAt;
  }

  public static create(title: string, path: string): RecentItem {
    const id = `rec-${Date.now()}`;
    return new RecentItem(id, title, path, new Date());
  }
}

/**
 * CommandDefinition Value Object
 */
export class CommandDefinition {
  public readonly commandId: string;
  public readonly title: string;
  public readonly category: string;
  public readonly shortcut?: string; // e.g. "⌘K", "Ctrl+P"
  public readonly actionHandler: () => void;

  private constructor(commandId: string, title: string, category: string, shortcut?: string, actionHandler?: () => void) {
    this.commandId = commandId;
    this.title = title;
    this.category = category;
    this.shortcut = shortcut;
    this.actionHandler = actionHandler || (() => {});
  }

  public static create(props: {
    commandId: string;
    title: string;
    category?: string;
    shortcut?: string;
    actionHandler?: () => void;
  }): CommandDefinition {
    return new CommandDefinition(props.commandId, props.title, props.category || 'General', props.shortcut, props.actionHandler);
  }
}

/**
 * SearchQuery Value Object
 */
export class SearchQuery {
  public readonly term: string;
  public readonly searchType: 'Global' | 'Command' | 'Entity' | 'Module' | 'Action';

  private constructor(term: string, searchType: 'Global' | 'Command' | 'Entity' | 'Module' | 'Action') {
    this.term = term.trim();
    this.searchType = searchType;
  }

  public static create(term: string, searchType: 'Global' | 'Command' | 'Entity' | 'Module' | 'Action' = 'Global'): SearchQuery {
    return new SearchQuery(term, searchType);
  }
}

/**
 * SearchResult Value Object
 */
export class SearchResult {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly path: string;
  public readonly category: string;
  public readonly relevanceScore: number;

  private constructor(id: string, title: string, description: string, path: string, category: string, relevanceScore: number) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.path = path;
    this.category = category;
    this.relevanceScore = relevanceScore;
  }

  public static create(props: {
    id: string;
    title: string;
    description: string;
    path: string;
    category: string;
    relevanceScore?: number;
  }): SearchResult {
    return new SearchResult(props.id, props.title, props.description, props.path, props.category, props.relevanceScore || 1.0);
  }
}

/**
 * NotificationBadge Value Object
 */
export class NotificationBadge {
  public readonly count: number;
  public readonly hasUnreadHighPriority: boolean;

  private constructor(count: number, hasUnreadHighPriority: boolean = false) {
    this.count = Math.max(0, count);
    this.hasUnreadHighPriority = hasUnreadHighPriority;
  }

  public static create(count: number, hasUnreadHighPriority?: boolean): NotificationBadge {
    return new NotificationBadge(count, hasUnreadHighPriority);
  }
}

/**
 * WorkspaceContext Value Object
 */
export class WorkspaceContext {
  public readonly workspaceId: WorkspaceId;
  public readonly workspaceType: 'Admin' | 'Restaurant' | 'POS' | 'Kitchen' | 'Customer' | 'Guest';
  public readonly status: WorkspaceStatus;
  public readonly navigationState: NavigationState;
  public readonly activePath: string;

  private constructor(props: {
    workspaceId: WorkspaceId;
    workspaceType: 'Admin' | 'Restaurant' | 'POS' | 'Kitchen' | 'Customer' | 'Guest';
    status: WorkspaceStatus;
    navigationState: NavigationState;
    activePath: string;
  }) {
    this.workspaceId = props.workspaceId;
    this.workspaceType = props.workspaceType;
    this.status = props.status;
    this.navigationState = props.navigationState;
    this.activePath = props.activePath;
  }

  public static create(props: {
    workspaceId?: WorkspaceId;
    workspaceType?: 'Admin' | 'Restaurant' | 'POS' | 'Kitchen' | 'Customer' | 'Guest';
    status?: WorkspaceStatus;
    navigationState?: NavigationState;
    activePath?: string;
  } = {}): WorkspaceContext {
    return new WorkspaceContext({
      workspaceId: props.workspaceId || WorkspaceId.create(),
      workspaceType: props.workspaceType || 'Admin',
      status: props.status || WorkspaceStatus.READY,
      navigationState: props.navigationState || NavigationState.EXPANDED,
      activePath: props.activePath || '/dashboard',
    });
  }
}
