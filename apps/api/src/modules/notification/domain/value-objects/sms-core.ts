import { Identifier, DomainPrimitive } from '@saas/domain';

export class SmsId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SmsId { return new SmsId(value); }
  public static generate(): SmsId { return new SmsId(crypto.randomUUID()); }
}

export class PhoneNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PhoneNumber {
    // Basic E.164 validation
    if (!/^\+[1-9]\d{1,14}$/.test(value)) {
      throw new Error(`Invalid E.164 phone number format: ${value}`);
    }
    return new PhoneNumber(value);
  }
}

export class SmsMessage extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SmsMessage {
    if (!value || value.trim().length === 0) throw new Error('SmsMessage cannot be empty');
    if (value.length > 1600) throw new Error('SmsMessage exceeds maximum allowed length');
    return new SmsMessage(value);
  }
}

export enum SmsPriorityEnum {
  BULK = 'BULK',
  STANDARD = 'STANDARD',
  TRANSACTIONAL = 'TRANSACTIONAL',
  CRITICAL = 'CRITICAL'
}

export class SmsPriority extends DomainPrimitive<SmsPriorityEnum> {
  private constructor(value: SmsPriorityEnum) { super(value); }
  public static create(value: SmsPriorityEnum): SmsPriority {
    if (!Object.values(SmsPriorityEnum).includes(value)) throw new Error(`Invalid SmsPriority: ${value}`);
    return new SmsPriority(value);
  }
}

export enum SmsStatusEnum {
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  UNDELIVERED = 'UNDELIVERED',
  REJECTED = 'REJECTED'
}

export class SmsStatus extends DomainPrimitive<SmsStatusEnum> {
  private constructor(value: SmsStatusEnum) { super(value); }
  public static create(value: SmsStatusEnum): SmsStatus {
    if (!Object.values(SmsStatusEnum).includes(value)) throw new Error(`Invalid SmsStatus: ${value}`);
    return new SmsStatus(value);
  }
}

export interface ProviderReferenceProps {
  providerName: 'TWILIO' | 'VONAGE' | 'MESSAGEBIRD' | 'AWS_SNS' | 'INFOBIP' | 'CUSTOM';
  messageId: string;
}

export class ProviderReference extends DomainPrimitive<ProviderReferenceProps> {
  private constructor(value: ProviderReferenceProps) { super(value); }
  public static create(value: ProviderReferenceProps): ProviderReference {
    return new ProviderReference(value);
  }
}

export class DeliveryReceiptId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DeliveryReceiptId { return new DeliveryReceiptId(value); }
}

export class CountryCode extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CountryCode {
    if (!/^[A-Z]{2}$/.test(value)) throw new Error(`Invalid ISO 3166-1 alpha-2 CountryCode: ${value}`);
    return new CountryCode(value);
  }
}

export class SenderId extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SenderId {
    if (value.length > 11) throw new Error('SenderId cannot exceed 11 characters');
    return new SenderId(value);
  }
}
