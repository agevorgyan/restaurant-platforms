import { Identifier, DomainPrimitive } from '@saas/domain';

export class InteractionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): InteractionId { return new InteractionId(value); }
  public static generate(): InteractionId { return new InteractionId(crypto.randomUUID()); }
}

export class InteractionNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): InteractionNumber {
    if (!value || value.trim().length === 0) throw new Error('Interaction number cannot be empty.');
    return new InteractionNumber(value);
  }
}

export class InteractionType extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): InteractionType {
    if (!value || value.trim().length === 0) throw new Error('Interaction type cannot be empty.');
    return new InteractionType(value);
  }
}

export enum InteractionChannelEnum {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  TELEGRAM = 'TELEGRAM',
  FACEBOOK_MESSENGER = 'FACEBOOK_MESSENGER',
  INSTAGRAM_DIRECT = 'INSTAGRAM_DIRECT',
  WEBSITE_CHAT = 'WEBSITE_CHAT',
  POS = 'POS',
  IN_PERSON_MEETING = 'IN_PERSON_MEETING',
  VIDEO_MEETING = 'VIDEO_MEETING'
}

export class InteractionChannel extends DomainPrimitive<InteractionChannelEnum> {
  private constructor(value: InteractionChannelEnum) { super(value); }
  public static create(value: InteractionChannelEnum): InteractionChannel {
    if (!Object.values(InteractionChannelEnum).includes(value)) throw new Error(`Invalid interaction channel: ${value}`);
    return new InteractionChannel(value);
  }
}

export enum InteractionDirectionEnum {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  INTERNAL = 'INTERNAL'
}

export class InteractionDirection extends DomainPrimitive<InteractionDirectionEnum> {
  private constructor(value: InteractionDirectionEnum) { super(value); }
  public static create(value: InteractionDirectionEnum): InteractionDirection {
    if (!Object.values(InteractionDirectionEnum).includes(value)) throw new Error(`Invalid interaction direction: ${value}`);
    return new InteractionDirection(value);
  }
}

export enum InteractionStatusEnum {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export class InteractionStatus extends DomainPrimitive<InteractionStatusEnum> {
  private constructor(value: InteractionStatusEnum) { super(value); }
  public static create(value: InteractionStatusEnum): InteractionStatus {
    if (!Object.values(InteractionStatusEnum).includes(value)) throw new Error(`Invalid interaction status: ${value}`);
    return new InteractionStatus(value);
  }
}

export class InteractionSubject extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): InteractionSubject {
    if (!value || value.trim().length === 0) throw new Error('Interaction subject cannot be empty.');
    return new InteractionSubject(value);
  }
}

export class OccurredAt extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): OccurredAt {
    return new OccurredAt(value);
  }
}

export class Duration extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): Duration {
    // duration in seconds
    if (value < 0) throw new Error('Duration cannot be negative.');
    return new Duration(value);
  }
}

export class Outcome extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): Outcome {
    return new Outcome(value);
  }
}
