import { CreateMembershipProgramDto, CreateRewardPolicyDto, MembershipTierDto, QualificationRuleDto, RewardRuleDto } from '../dto/membership-reward.dto';

export function validateCreateMembershipProgram(dto: CreateMembershipProgramDto): string[] {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.effectiveStartDate) errors.push('effectiveStartDate is required');
  return errors;
}

export function validateMembershipTier(dto: MembershipTierDto): string[] {
  const errors: string[] = [];
  if (!dto.name) errors.push('tier name is required');
  if (typeof dto.minimumPoints !== 'number' || dto.minimumPoints < 0) errors.push('minimumPoints must be non-negative');
  if (typeof dto.priority !== 'number' || dto.priority < 0) errors.push('priority must be non-negative');
  return errors;
}

export function validateQualificationRule(dto: QualificationRuleDto): string[] {
  const errors: string[] = [];
  if (!dto.metric) errors.push('metric is required');
  if (!dto.operator) errors.push('operator is required');
  if (typeof dto.value !== 'number') errors.push('value must be a number');
  return errors;
}

export function validateCreateRewardPolicy(dto: CreateRewardPolicyDto): string[] {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.validStartDate) errors.push('validStartDate is required');
  if (!dto.validEndDate) errors.push('validEndDate is required');
  return errors;
}

export function validateRewardRule(dto: RewardRuleDto): string[] {
  const errors: string[] = [];
  if (!dto.rewardType) errors.push('rewardType is required');
  if (!dto.triggerType) errors.push('triggerType is required');
  if (typeof dto.rewardValue !== 'number') errors.push('rewardValue must be a number');
  return errors;
}
