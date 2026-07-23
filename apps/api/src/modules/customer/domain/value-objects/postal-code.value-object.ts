import { ValueObject } from '@saas/core';

export interface PostalCodeProps { code: string; }

export class PostalCode extends ValueObject<PostalCodeProps> {
  get code(): string { return this.props.code; }
  private constructor(props: PostalCodeProps) { super(props); }
  public static create(code: string): PostalCode {
    return new PostalCode({ code });
  }
}