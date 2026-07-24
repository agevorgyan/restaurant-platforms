import { Identifier, DomainPrimitive } from '@saas/domain';

export class InAppNotificationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): InAppNotificationId { return new InAppNotificationId(value); }
  public static generate(): InAppNotificationId { return new InAppNotificationId(crypto.randomUUID()); }
}

export enum NotificationCategoryEnum {
  SYSTEM = 'SYSTEM',
  BILLING = 'BILLING',
  ORDER = 'ORDER',
  SECURITY = 'SECURITY',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  MESSAGE = 'MESSAGE'
}

export class NotificationCategory extends DomainPrimitive<NotificationCategoryEnum> {
  private constructor(value: NotificationCategoryEnum) { super(value); }
  public static create(value: NotificationCategoryEnum): NotificationCategory {
    if (!Object.values(NotificationCategoryEnum).includes(value)) throw new Error(`Invalid NotificationCategory: ${value}`);
    return new NotificationCategory(value);
  }
}

export enum NotificationSeverityEnum {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

export class NotificationSeverity extends DomainPrimitive<NotificationSeverityEnum> {
  private constructor(value: NotificationSeverityEnum) { super(value); }
  public static create(value: NotificationSeverityEnum): NotificationSeverity {
    if (!Object.values(NotificationSeverityEnum).includes(value)) throw new Error(`Invalid NotificationSeverity: ${value}`);
    return new NotificationSeverity(value);
  }
}

export enum NotificationPriorityEnum {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export class NotificationPriority extends DomainPrimitive<NotificationPriorityEnum> {
  private constructor(value: NotificationPriorityEnum) { super(value); }
  public static create(value: NotificationPriorityEnum): NotificationPriority {
    if (!Object.values(NotificationPriorityEnum).includes(value)) throw new Error(`Invalid NotificationPriority: ${value}`);
    return new NotificationPriority(value);
  }
}

export enum NotificationStatusEnum {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
  DISMISSED = 'DISMISSED',
  EXPIRED = 'EXPIRED'
}

export class NotificationStatus extends DomainPrimitive<NotificationStatusEnum> {
  private constructor(value: NotificationStatusEnum) { super(value); }
  public static create(value: NotificationStatusEnum): NotificationStatus {
    if (!Object.values(NotificationStatusEnum).includes(value)) throw new Error(`Invalid NotificationStatus: ${value}`);
    return new NotificationStatus(value);
  }
}

export class RecipientReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RecipientReference {
    if (!value || value.trim().length === 0) throw new Error('RecipientReference cannot be empty');
    return new RecipientReference(value);
  }
}

export class BadgeCount extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): BadgeCount {
    if (value < 0) throw new Error('BadgeCount cannot be negative');
    return new BadgeCount(value);
  }
}

export class NotificationExpiry extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): NotificationExpiry {
    if (value.getTime() < Date.now()) throw new Error('NotificationExpiry cannot be in the past');
    return new NotificationExpiry(value);
  }
}

export interface NotificationActionProps {
  label: string;
  url?: string;
  actionType: 'NAVIGATE' | 'API_CALL' | 'DISMISS';
  payload?: Record<string, any>;
}

export class NotificationAction extends DomainPrimitive<NotificationActionProps> {
  private constructor(value: NotificationActionProps) { super(value); }
  public static create(value: NotificationActionProps): NotificationAction {
    if (!value.label) throw new Error('NotificationAction label is required');
    return new NotificationAction(value);
  }
}
