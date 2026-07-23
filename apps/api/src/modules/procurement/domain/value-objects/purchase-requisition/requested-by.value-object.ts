import { ValueObject } from '@saas/core';

export interface RequestedByProps {
  userId: string;
  userName?: string;
}

export class RequestedBy extends ValueObject<RequestedByProps> {
  get userId(): string {
    return this.props.userId;
  }

  get userName(): string | undefined {
    return this.props.userName;
  }

  private constructor(props: RequestedByProps) {
    super(props);
  }

  public static create(userId: string, userName?: string): RequestedBy {
    if (!userId || userId.trim() === '') {
      throw new Error('Requester User ID is required');
    }
    return new RequestedBy({ userId: userId.trim(), userName });
  }
}
