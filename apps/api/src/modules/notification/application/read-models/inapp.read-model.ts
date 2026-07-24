export interface InAppNotification {
  inAppId: string;
  tenantId: string;
  recipientId: string;
  category: 'SYSTEM' | 'BILLING' | 'ORDER' | 'SECURITY' | 'ANNOUNCEMENT' | 'MESSAGE';
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'CRITICAL';
  title: string;
  message: string;
  icon?: string;
  actions?: Array<{
    label: string;
    url?: string;
    actionType: 'NAVIGATE' | 'API_CALL' | 'DISMISS';
    payload?: any;
  }>;
  status: 'UNREAD' | 'READ' | 'ARCHIVED' | 'DISMISSED' | 'EXPIRED';
  isPinned: boolean;
  expiresAt?: Date;
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationFeed {
  userId: string;
  tenantId: string;
  notifications: InAppNotification[];
  totalCount: number;
  unreadCount: number;
  lastUpdated: Date;
}

export interface UnreadCounter {
  userId: string;
  tenantId: string;
  count: number;
  lastCalculated: Date;
}

export interface NotificationStatistics {
  tenantId: string;
  period: string; // YYYY-MM
  totalCreated: number;
  totalRead: number;
  totalDismissed: number;
  averageReadTimeMs: number;
}

export interface NotificationPreference {
  userId: string;
  tenantId: string;
  mutedCategories: string[];
  desktopNotificationsEnabled: boolean;
  soundEnabled: boolean;
}

export interface ExpiredNotification {
  inAppId: string;
  tenantId: string;
  expiredAt: Date;
  wasRead: boolean;
}
