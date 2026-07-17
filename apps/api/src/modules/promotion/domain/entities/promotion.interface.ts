import { PromotionType } from '../value-objects/promotion-type.value-object';
import { PromotionStatus } from '../value-objects/promotion-status.value-object';
import { PromotionValidity } from '../value-objects/promotion-validity.value-object';
import { PromotionUsageLimit } from '../value-objects/promotion-usage-limit.value-object';
import { PromotionRule } from '../value-objects/promotion-rule.value-object';
import { PromotionReward } from '../value-objects/promotion-reward.value-object';

export interface IPromotion {
  id: string;
  restaurantId: string;
  code: string;
  name: string;
  description?: string;
  type: PromotionType;
  status: PromotionStatus;
  priority: number;
  stackable: boolean;
  rules: PromotionRule[];
  reward: PromotionReward;
  validity: PromotionValidity;
  usageLimit: PromotionUsageLimit;
  createdAt: Date;
  updatedAt: Date;
}
