export interface MembershipTierDto {
  name: string;
  minimumPoints: number;
  benefits: string[];
  priority: number;
}

export interface QualificationRuleDto {
  metric: string;
  operator: string;
  value: number;
}

export interface CreateMembershipProgramDto {
  restaurantId: string;
  name: string;
  effectiveStartDate: Date;
  effectiveEndDate?: Date;
}

export interface RewardRuleDto {
  rewardType: string;
  triggerType: string;
  rewardValue: number;
  conditions: Record<string, any>;
}

export interface CreateRewardPolicyDto {
  restaurantId: string;
  name: string;
  validStartDate: Date;
  validEndDate: Date;
}
