import { ValueObject } from '@saas/core';

export interface DisplayedPriceProps { formattedValue: string; }

export class DisplayedPrice extends ValueObject<DisplayedPriceProps> {
  get formattedValue(): string { return this.props.formattedValue; }
  private constructor(props: DisplayedPriceProps) { super(props); }
  public static create(formattedValue: string): DisplayedPrice {
    if (!formattedValue) throw new Error('Displayed price cannot be empty');
    return new DisplayedPrice({ formattedValue });
  }
}