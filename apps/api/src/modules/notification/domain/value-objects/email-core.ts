import { Identifier, DomainPrimitive } from '@saas/domain';

export class EmailId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EmailId { return new EmailId(value); }
  public static generate(): EmailId { return new EmailId(crypto.randomUUID()); }
}

export class EmailAddress extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EmailAddress {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error(`Invalid email address format: ${value}`);
    }
    return new EmailAddress(value);
  }
}

export class EmailSubject extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EmailSubject {
    if (!value || value.trim().length === 0) throw new Error('EmailSubject cannot be empty');
    return new EmailSubject(value);
  }
}

export interface EmailBodyProps {
  text: string;
  html?: string;
}

export class EmailBody extends DomainPrimitive<EmailBodyProps> {
  private constructor(value: EmailBodyProps) { super(value); }
  public static create(value: EmailBodyProps): EmailBody {
    if (!value.text && !value.html) throw new Error('EmailBody must contain either text or html content');
    return new EmailBody(value);
  }
}

export class EmailTemplateId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EmailTemplateId { return new EmailTemplateId(value); }
}

export enum EmailPriorityEnum {
  BULK = 'BULK',
  STANDARD = 'STANDARD',
  TRANSACTIONAL = 'TRANSACTIONAL'
}

export class EmailPriority extends DomainPrimitive<EmailPriorityEnum> {
  private constructor(value: EmailPriorityEnum) { super(value); }
  public static create(value: EmailPriorityEnum): EmailPriority {
    if (!Object.values(EmailPriorityEnum).includes(value)) throw new Error(`Invalid EmailPriority: ${value}`);
    return new EmailPriority(value);
  }
}

export enum EmailStatusEnum {
  DRAFT = 'DRAFT',
  QUEUED = 'QUEUED',
  SENDING = 'SENDING',
  DELIVERED = 'DELIVERED',
  BOUNCED = 'BOUNCED',
  DEFERRED = 'DEFERRED',
  COMPLAINED = 'COMPLAINED'
}

export class EmailStatus extends DomainPrimitive<EmailStatusEnum> {
  private constructor(value: EmailStatusEnum) { super(value); }
  public static create(value: EmailStatusEnum): EmailStatus {
    if (!Object.values(EmailStatusEnum).includes(value)) throw new Error(`Invalid EmailStatus: ${value}`);
    return new EmailStatus(value);
  }
}

export interface ProviderReferenceProps {
  providerName: 'AWS_SES' | 'SENDGRID' | 'MAILGUN' | 'POSTMARK' | 'SMTP';
  messageId: string;
}

export class ProviderReference extends DomainPrimitive<ProviderReferenceProps> {
  private constructor(value: ProviderReferenceProps) { super(value); }
  public static create(value: ProviderReferenceProps): ProviderReference {
    return new ProviderReference(value);
  }
}

export enum BounceReasonEnum {
  HARD_BOUNCE = 'HARD_BOUNCE',
  SOFT_BOUNCE = 'SOFT_BOUNCE',
  SPAM_COMPLAINT = 'SPAM_COMPLAINT',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  UNKNOWN = 'UNKNOWN'
}

export class BounceReason extends DomainPrimitive<BounceReasonEnum> {
  private constructor(value: BounceReasonEnum) { super(value); }
  public static create(value: BounceReasonEnum): BounceReason {
    if (!Object.values(BounceReasonEnum).includes(value)) throw new Error(`Invalid BounceReason: ${value}`);
    return new BounceReason(value);
  }
}
