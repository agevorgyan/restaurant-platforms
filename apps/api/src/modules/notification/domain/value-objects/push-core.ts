import { Identifier, DomainPrimitive } from '@saas/domain';

export class PushNotificationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PushNotificationId { return new PushNotificationId(value); }
  public static generate(): PushNotificationId { return new PushNotificationId(crypto.randomUUID()); }
}

export class DeviceToken extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DeviceToken {
    if (!value || value.trim().length === 0) throw new Error('DeviceToken cannot be empty');
    return new DeviceToken(value);
  }
}

export enum DevicePlatformEnum {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
  WEB = 'WEB',
  DESKTOP = 'DESKTOP'
}

export class DevicePlatform extends DomainPrimitive<DevicePlatformEnum> {
  private constructor(value: DevicePlatformEnum) { super(value); }
  public static create(value: DevicePlatformEnum): DevicePlatform {
    if (!Object.values(DevicePlatformEnum).includes(value)) throw new Error(`Invalid DevicePlatform: ${value}`);
    return new DevicePlatform(value);
  }
}

export class PushTopic extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PushTopic {
    if (!value || value.trim().length === 0) throw new Error('PushTopic cannot be empty');
    if (!/^[a-zA-Z0-9-_.~%]+$/.test(value)) throw new Error('Invalid PushTopic format');
    return new PushTopic(value);
  }
}

export enum PushPriorityEnum {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH'
}

export class PushPriority extends DomainPrimitive<PushPriorityEnum> {
  private constructor(value: PushPriorityEnum) { super(value); }
  public static create(value: PushPriorityEnum): PushPriority {
    if (!Object.values(PushPriorityEnum).includes(value)) throw new Error(`Invalid PushPriority: ${value}`);
    return new PushPriority(value);
  }
}

export enum PushStatusEnum {
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  UNREGISTERED = 'UNREGISTERED'
}

export class PushStatus extends DomainPrimitive<PushStatusEnum> {
  private constructor(value: PushStatusEnum) { super(value); }
  public static create(value: PushStatusEnum): PushStatus {
    if (!Object.values(PushStatusEnum).includes(value)) throw new Error(`Invalid PushStatus: ${value}`);
    return new PushStatus(value);
  }
}

export class CollapseKey extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CollapseKey {
    return new CollapseKey(value);
  }
}

export class TimeToLive extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): TimeToLive {
    // Max TTL is typically 4 weeks (2419200 seconds)
    if (value < 0 || value > 2419200) throw new Error(`Invalid TimeToLive: ${value}`);
    return new TimeToLive(value);
  }
}

export interface ProviderReferenceProps {
  providerName: 'FCM' | 'APNS' | 'WEB_PUSH' | 'AZURE' | 'AWS_SNS';
  messageId: string;
}

export class ProviderReference extends DomainPrimitive<ProviderReferenceProps> {
  private constructor(value: ProviderReferenceProps) { super(value); }
  public static create(value: ProviderReferenceProps): ProviderReference {
    return new ProviderReference(value);
  }
}
