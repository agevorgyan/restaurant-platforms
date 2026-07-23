import { ValueObject } from '@saas/core';

export interface DeliveryInstructionsProps { text: string; }

export class DeliveryInstructions extends ValueObject<DeliveryInstructionsProps> {
  get text(): string { return this.props.text; }
  private constructor(props: DeliveryInstructionsProps) { super(props); }
  public static create(text: string): DeliveryInstructions {
    if (text.length > 500) throw new Error('DeliveryInstructions maximum length exceeded');
    return new DeliveryInstructions({ text });
  }
}