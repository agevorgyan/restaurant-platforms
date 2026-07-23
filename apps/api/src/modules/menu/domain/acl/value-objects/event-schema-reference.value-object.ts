import { ValueObject } from '@saas/core';

export interface EventSchemaReferenceProps { schema: string; }

export class EventSchemaReference extends ValueObject<EventSchemaReferenceProps> {
  get schema(): string { return this.props.schema; }
  private constructor(props: EventSchemaReferenceProps) { super(props); }
  public static create(schema: string): EventSchemaReference {
    return new EventSchemaReference({ schema });
  }
}