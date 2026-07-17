import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IPromotionRepository } from '../../domain/repositories/promotion.repository.interface';
import { IPromotion } from '../../domain/entities/promotion.interface';
import { PromotionType } from '../../domain/value-objects/promotion-type.value-object';
import { PromotionStatus } from '../../domain/value-objects/promotion-status.value-object';
import { PromotionValidity } from '../../domain/value-objects/promotion-validity.value-object';
import { PromotionUsageLimit } from '../../domain/value-objects/promotion-usage-limit.value-object';
import { PromotionRule } from '../../domain/value-objects/promotion-rule.value-object';
import { PromotionReward } from '../../domain/value-objects/promotion-reward.value-object';
import { CreatePromotionDto, ApplyPromotionDto } from '../dto/promotion.dto';
import { validateCreatePromotion } from '../validation/promotion.schema';
import { PromotionCreatedEvent, PromotionExpiredEvent } from '../../domain/events/promotion.events';

@Injectable()
export class PromotionService {
  constructor(
    @Inject('IPromotionRepository') private readonly repository: IPromotionRepository,
  ) {}

  async create(dto: CreatePromotionDto): Promise<IPromotion> {
    const errors = validateCreatePromotion(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Business Rule: Promotion code must be unique within the restaurant.
    const existing = await this.repository.findByCode(dto.restaurantId, dto.code);
    if (existing) {
      throw new BadRequestException(`Promotion code '${dto.code}' already exists`);
    }

    const type = new PromotionType(dto.type);
    const status = new PromotionStatus('Draft');
    
    const reward = new PromotionReward(
      dto.reward.type,
      dto.reward.value,
      dto.reward.buyQuantity,
      dto.reward.getQuantity,
      dto.reward.rewardProductId
    );

    const validity = new PromotionValidity(
      dto.validity.startDate,
      dto.validity.endDate
    );

    const usageLimit = new PromotionUsageLimit(
      dto.usageLimit?.maxUses,
      dto.usageLimit?.currentUses || 0,
      dto.usageLimit?.maxUsesPerCustomer
    );

    const rules = (dto.rules || []).map(r => new PromotionRule(
      r.minOrderAmount,
      r.minQuantity,
      r.applicableProductIds,
      r.applicableCategoryIds,
      r.applicableBranchIds,
      r.specificCustomerIds
    ));

    const promotion: IPromotion = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      type,
      status,
      priority: dto.priority || 0,
      stackable: dto.stackable || false,
      rules,
      reward,
      validity,
      usageLimit,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(promotion);
    new PromotionCreatedEvent(created);
    return created;
  }

  async apply(dto: ApplyPromotionDto): Promise<IPromotion> {
    const promotion = await this.repository.findByCode(dto.restaurantId, dto.code);
    
    if (!promotion) {
      throw new NotFoundException(`Promotion code '${dto.code}' not found`);
    }

    // Business Rule: Expired or Disabled promotions cannot be applied.
    if (!promotion.status.canBeApplied()) {
      throw new BadRequestException(`Promotion '${dto.code}' cannot be applied. Status: ${promotion.status.value}`);
    }

    // Business Rule: Expired validity check
    if (!promotion.validity.isActive()) {
      // Transition to expired
      await this.repository.update(promotion.id, { status: new PromotionStatus('Expired') });
      new PromotionExpiredEvent(promotion.id);
      throw new BadRequestException(`Promotion '${dto.code}' has expired`);
    }

    // Business Rule: Usage limits must be enforced
    if (!promotion.usageLimit.canBeUsed()) {
      throw new BadRequestException(`Promotion '${dto.code}' usage limit reached`);
    }

    // Apply: Increment usage
    const updatedUsageLimit = promotion.usageLimit.increment();
    const updated = await this.repository.update(promotion.id, {
      usageLimit: updatedUsageLimit,
      updatedAt: new Date()
    });

    return updated;
  }
}
