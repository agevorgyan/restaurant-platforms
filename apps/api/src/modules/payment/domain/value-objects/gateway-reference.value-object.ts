import { ValueObject } from '@saas/core';

export interface GatewayReferenceProps {
  value: string;
}

export class GatewayReference extends ValueObject<GatewayReferenceProps> {
  private constructor(props: GatewayReferenceProps) {
    super(props);
  }

  public static create(value: string): GatewayReference {
    if (!value || value.trim().length === 0) {
      throw new Error('GatewayReference cannot be empty');
    }
    if (value.length > 255) {
      throw new Error('GatewayReference is too long');
    }

    return new GatewayReference({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
