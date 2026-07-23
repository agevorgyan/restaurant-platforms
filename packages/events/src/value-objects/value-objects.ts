import { ValueObject } from '@saas/core';

export type EventIdProps = { value: string };
export class EventId extends ValueObject<EventIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: EventIdProps) { super(props); }
  public static create(value: string): EventId { return new EventId({ value }); }
}

export type EventVersionProps = { value: string };
export class EventVersion extends ValueObject<EventVersionProps> {
  get value(): string { return this.props.value; }
  private constructor(props: EventVersionProps) { super(props); }
  public static create(value: string): EventVersion { return new EventVersion({ value }); }
}

export type CorrelationIdProps = { value: string };
export class CorrelationId extends ValueObject<CorrelationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: CorrelationIdProps) { super(props); }
  public static create(value: string): CorrelationId { return new CorrelationId({ value }); }
}

export type CausationIdProps = { value: string };
export class CausationId extends ValueObject<CausationIdProps> {
  get value(): string { return this.props.value; }
  private constructor(props: CausationIdProps) { super(props); }
  public static create(value: string): CausationId { return new CausationId({ value }); }
}

export type AggregateVersionProps = { value: number };
export class AggregateVersion extends ValueObject<AggregateVersionProps> {
  get value(): number { return this.props.value; }
  private constructor(props: AggregateVersionProps) { super(props); }
  public static create(value: number): AggregateVersion { return new AggregateVersion({ value }); }
}
