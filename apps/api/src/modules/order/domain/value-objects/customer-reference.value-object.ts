import { ValueObject } from '@saas/core';

export interface CustomerReferenceProps {
  value: string;
}

export class CustomerReference extends ValueObject<CustomerReferenceProps> {
  private constructor(props: CustomerReferenceProps) {
    super(props);
  }

  public static create(value: string): CustomerReference {
    if (!value || value.trim().length === 0) {
      throw new Error('CustomerReference cannot be empty');
    }
    
    // Validate UUID format roughly
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('CustomerReference must be a valid UUID');
    }

    return new CustomerReference({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
