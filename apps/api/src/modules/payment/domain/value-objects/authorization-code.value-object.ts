import { ValueObject } from '@saas/core';

export interface AuthorizationCodeProps {
  value: string;
}

export class AuthorizationCode extends ValueObject<AuthorizationCodeProps> {
  private constructor(props: AuthorizationCodeProps) {
    super(props);
  }

  public static create(value: string): AuthorizationCode {
    if (!value || value.trim().length === 0) {
      throw new Error('AuthorizationCode cannot be empty');
    }
    if (value.length > 50) {
      throw new Error('AuthorizationCode is too long');
    }

    return new AuthorizationCode({ value: value.trim() });
  }

  get value(): string {
    return this.props.value;
  }
}
