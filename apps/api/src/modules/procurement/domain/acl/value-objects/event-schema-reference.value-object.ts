import { ValueObject } from '@saas/core';

export interface EventSchemaReferenceProps { schemaUri: string; }

export class EventSchemaReference extends ValueObject<EventSchemaReferenceProps> {
  get schemaUri(): string { return this.props.schemaUri; }
  private constructor(props: EventSchemaReferenceProps) { super(props); }
  public static create(schemaUri: string): EventSchemaReference {
    if (!schemaUri) throw new Error('Schema URI is required');
    return new EventSchemaReference({ schemaUri });
  }
}