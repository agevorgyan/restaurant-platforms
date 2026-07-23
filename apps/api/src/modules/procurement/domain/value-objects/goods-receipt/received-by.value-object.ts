import { ValueObject } from '@saas/core';

export interface ReceivedByProps { userId: string; }

export class ReceivedBy extends ValueObject<ReceivedByProps> {
  get userId(): string { return this.props.userId; }
  private constructor(props: ReceivedByProps) { super(props); }
  public static create(userId: string): ReceivedBy {
    if (!userId) throw new Error('ReceivedBy user ID cannot be empty');
    return new ReceivedBy({ userId });
  }
}