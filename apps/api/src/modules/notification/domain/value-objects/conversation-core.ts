import { Identifier, DomainPrimitive } from '@saas/domain';

export enum ConversationChannelEnum {
  WHATSAPP = 'WHATSAPP',
  TELEGRAM = 'TELEGRAM'
}

export class ConversationChannel extends DomainPrimitive<ConversationChannelEnum> {
  private constructor(value: ConversationChannelEnum) { super(value); }
  public static create(value: ConversationChannelEnum): ConversationChannel {
    if (!Object.values(ConversationChannelEnum).includes(value)) throw new Error(`Invalid ConversationChannel: ${value}`);
    return new ConversationChannel(value);
  }
}

export class PhoneNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PhoneNumber {
    if (!/^\+[1-9]\d{1,14}$/.test(value)) {
      throw new Error(`Invalid E.164 phone number format: ${value}`);
    }
    return new PhoneNumber(value);
  }
}

export class TelegramChatId extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TelegramChatId {
    if (!value || value.trim().length === 0) throw new Error('TelegramChatId cannot be empty');
    return new TelegramChatId(value);
  }
}

export class TemplateId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TemplateId { return new TemplateId(value); }
}

export class MessageId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MessageId { return new MessageId(value); }
  public static generate(): MessageId { return new MessageId(crypto.randomUUID()); }
}

export enum MessageStatusEnum {
  QUEUED = 'QUEUED',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED'
}

export class MessageStatus extends DomainPrimitive<MessageStatusEnum> {
  private constructor(value: MessageStatusEnum) { super(value); }
  public static create(value: MessageStatusEnum): MessageStatus {
    if (!Object.values(MessageStatusEnum).includes(value)) throw new Error(`Invalid MessageStatus: ${value}`);
    return new MessageStatus(value);
  }
}

export interface MediaReferenceProps {
  url: string;
  type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'AUDIO';
  caption?: string;
  filename?: string;
}

export class MediaReference extends DomainPrimitive<MediaReferenceProps> {
  private constructor(value: MediaReferenceProps) { super(value); }
  public static create(value: MediaReferenceProps): MediaReference {
    if (!value.url || !value.url.startsWith('https://')) throw new Error('Media URL must be valid HTTPS');
    return new MediaReference(value);
  }
}

export interface ProviderReferenceProps {
  providerName: 'WHATSAPP_CLOUD' | 'TELEGRAM_BOT';
  providerMessageId: string;
}

export class ProviderReference extends DomainPrimitive<ProviderReferenceProps> {
  private constructor(value: ProviderReferenceProps) { super(value); }
  public static create(value: ProviderReferenceProps): ProviderReference {
    return new ProviderReference(value);
  }
}
