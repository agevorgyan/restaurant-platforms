import { ValueObject } from '@saas/core';

export interface AuthorizationReferenceProps {
  value: string;
}

export class AuthorizationReference extends ValueObject<AuthorizationReferenceProps> {
  private constructor(props: AuthorizationReferenceProps) {
    super(props);
  }

  public static create(value: string): AuthorizationReference {
    if (!value || value.trim().length === 0) {
      throw new Error('AuthorizationReference cannot be empty');
    }
    return new AuthorizationReference({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
