import { PromotionTypeEnum } from '../../domain/value-objects/promotion-type.value-object';


export class PromotionRuleDto {
  minOrderAmount?: number;
  minQuantity?: number;
  applicableProductIds?: string[];
  applicableCategoryIds?: string[];
  applicableBranchIds?: string[];
  specificCustomerIds?: string[];
}

export class PromotionRewardDto {
  type: PromotionTypeEnum;
  value?: number;
  buyQuantity?: number;
  getQuantity?: number;
  rewardProductId?: string;
}

export class PromotionValidityDto {
  startDate: Date;
  endDate?: Date;
}

export class PromotionUsageLimitDto {
  maxUses?: number;
  currentUses?: number;
  maxUsesPerCustomer?: number;
}

export class CreatePromotionDto {
  restaurantId: string;
  code: string;
  name: string;
  description?: string;
  type: PromotionTypeEnum;
  priority: number;
  stackable: boolean;
  rules: PromotionRuleDto[];
  reward: PromotionRewardDto;
  validity: PromotionValidityDto;
  usageLimit: PromotionUsageLimitDto;
}

export class ApplyPromotionDto {
  restaurantId: string;
  code: string;
}
