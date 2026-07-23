import { ValueObject } from '@saas/core';

export interface RewardReferenceProps { rewardId: string; }

export class RewardReference extends ValueObject<RewardReferenceProps> {
  get rewardId(): string { return this.props.rewardId; }
  private constructor(props: RewardReferenceProps) { super(props); }
  public static create(rewardId: string): RewardReference {
    return new RewardReference({ rewardId });
  }
}