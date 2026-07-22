import { ValueObject } from '@saas/core';

export interface KitchenTicketIdProps {
  value: string;
}

export class KitchenTicketId extends ValueObject<KitchenTicketIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: KitchenTicketIdProps) {
    super(props);
  }

  public static create(value?: string): KitchenTicketId {
    return new KitchenTicketId({
      value: value || crypto.randomUUID(),
    });
  }
}
