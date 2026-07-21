import { ValueObject } from '@saas/core';

export interface RestaurantReferenceProps {
  value: string;
}

export class RestaurantReference extends ValueObject<RestaurantReferenceProps> {
  private constructor(props: RestaurantReferenceProps) {
    super(props);
  }

  public static create(value: string): RestaurantReference {
    if (!value || value.trim().length === 0) {
      throw new Error('RestaurantReference cannot be empty');
    }
    
    // Validate UUID format roughly
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('RestaurantReference must be a valid UUID');
    }

    return new RestaurantReference({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
