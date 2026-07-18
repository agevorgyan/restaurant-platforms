import { RewardType } from '../value-objects/reward-type.value-object';

export interface IRewardRule {
  id: string;
  rewardType: RewardType;
  triggerType: string;
  rewardValue: number;
  conditions: Record<string, any>;
}
