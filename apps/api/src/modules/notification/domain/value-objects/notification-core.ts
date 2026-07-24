import { Identifier, DomainPrimitive } from '@saas/domain';

export class NotificationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): NotificationId { return new NotificationId(value); }
  public static generate(): NotificationId { return new NotificationId(crypto.randomUUID()); }
}

export enum NotificationTypeEnum {
  TRANSACTIONAL = 'TRANSACTIONAL',
  PROMOTIONAL = 'PROMOTIONAL',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  CHAT = 'CHAT'
}

export class NotificationType extends DomainPrimitive<NotificationTypeEnum> {
  private constructor(value: NotificationTypeEnum) { super(value); }
  public static create(value: NotificationTypeEnum): NotificationType {
    if (!Object.values(NotificationTypeEnum).includes(value)) throw new Error(`Invalid NotificationType: ${value}`);
    return new NotificationType(value);
  }
}

export enum NotificationChannelEnum {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
  WHATSAPP = 'WHATSAPP',
  TELEGRAM = 'TELEGRAM',
  VOICE = 'VOICE'
}

export class NotificationChannel extends DomainPrimitive<NotificationChannelEnum> {
  private constructor(value: NotificationChannelEnum) { super(value); }
  public static create(value: NotificationChannelEnum): NotificationChannel {
    if (!Object.values(NotificationChannelEnum).includes(value)) throw new Error(`Invalid NotificationChannel: ${value}`);
    return new NotificationChannel(value);
  }
}

export enum NotificationPriorityEnum {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class NotificationPriority extends DomainPrimitive<NotificationPriorityEnum> {
  private constructor(value: NotificationPriorityEnum) { super(value); }
  public static create(value: NotificationPriorityEnum): NotificationPriority {
    if (!Object.values(NotificationPriorityEnum).includes(value)) throw new Error(`Invalid NotificationPriority: ${value}`);
    return new NotificationPriority(value);
  }
}

export enum NotificationStatusEnum {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
  OPENED = 'OPENED',
  CLICKED = 'CLICKED'
}

export class NotificationStatus extends DomainPrimitive<NotificationStatusEnum> {
  private constructor(value: NotificationStatusEnum) { super(value); }
  public static create(value: NotificationStatusEnum): NotificationStatus {
    if (!Object.values(NotificationStatusEnum).includes(value)) throw new Error(`Invalid NotificationStatus: ${value}`);
    return new NotificationStatus(value);
  }
}

export interface RecipientProps {
  userId?: string;
  email?: string;
  phoneNumber?: string;
  deviceToken?: string;
}

export class Recipient extends DomainPrimitive<RecipientProps> {
  private constructor(value: RecipientProps) { super(value); }
  public static create(value: RecipientProps): Recipient {
    if (!value.userId && !value.email && !value.phoneNumber && !value.deviceToken) {
      throw new Error('Recipient must have at least one valid target (userId, email, phone, token)');
    }
    return new Recipient(value);
  }
}

export enum DeliveryPolicyEnum {
  IMMEDIATE = 'IMMEDIATE',
  SCHEDULED = 'SCHEDULED',
  DELAYED = 'DELAYED',
  GUARANTEED = 'GUARANTEED'
}

export class DeliveryPolicy extends DomainPrimitive<DeliveryPolicyEnum> {
  private constructor(value: DeliveryPolicyEnum) { super(value); }
  public static create(value: DeliveryPolicyEnum): DeliveryPolicy {
    if (!Object.values(DeliveryPolicyEnum).includes(value)) throw new Error(`Invalid DeliveryPolicy: ${value}`);
    return new DeliveryPolicy(value);
  }
}

export interface RetryPolicyProps {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelayMs: number;
}

export class RetryPolicy extends DomainPrimitive<RetryPolicyProps> {
  private constructor(value: RetryPolicyProps) { super(value); }
  public static create(value: RetryPolicyProps): RetryPolicy {
    if (value.maxRetries < 0) throw new Error('maxRetries cannot be negative');
    return new RetryPolicy(value);
  }
}

export interface SchedulePolicyProps {
  scheduledFor: Date;
  timezone?: string;
}

export class SchedulePolicy extends DomainPrimitive<SchedulePolicyProps> {
  private constructor(value: SchedulePolicyProps) { super(value); }
  public static create(value: SchedulePolicyProps): SchedulePolicy {
    if (value.scheduledFor.getTime() < Date.now()) throw new Error('Cannot schedule in the past');
    return new SchedulePolicy(value);
  }
}

export interface TemplateReferenceProps {
  templateId: string;
  version: string;
  locale: string;
}

export class TemplateReference extends DomainPrimitive<TemplateReferenceProps> {
  private constructor(value: TemplateReferenceProps) { super(value); }
  public static create(value: TemplateReferenceProps): TemplateReference {
    return new TemplateReference(value);
  }
}
