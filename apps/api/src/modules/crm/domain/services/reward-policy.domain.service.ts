import { IRewardPolicy } from '../entities/reward-policy.interface';
import { IRewardRule } from '../entities/reward-rule.interface';
import { IRewardPolicyRepository } from '../repositories/reward-policy.repository.interface';
import { MembershipStatus } from '../value-objects/membership-status.value-object';
import { RewardValidityPeriod } from '../value-objects/reward-validity-period.value-object';
import { RewardType, RewardTypeValue } from '../value-objects/reward-type.value-object';
import {
  CreateRewardPolicyDto,
  RewardRuleDto
} from '../../application/dto/membership-reward.dto';
import {
  validateCreateRewardPolicy,
  validateRewardRule
} from '../../application/validation/membership-reward.schema';
import {
  RewardPolicyCreatedEvent,
  RewardPolicyPublishedEvent,
  RewardRuleUpdatedEvent
} from '../events/membership-reward.events';

export class RewardPolicyDomainService {
  constructor(private readonly policyRepo: IRewardPolicyRepository) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private ensureNotArchived(policy: IRewardPolicy) {
    if (policy.status.isArchived()) {
      throw new Error('Archived policies are read-only');
    }
  }

  async createPolicy(id: string, dto: CreateRewardPolicyDto): Promise<IRewardPolicy> {
    const errors = validateCreateRewardPolicy(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const validityPeriod = new RewardValidityPeriod(dto.validStartDate, dto.validEndDate);
    
    const existingPolicies = await this.policyRepo.findByRestaurantId(dto.restaurantId);
    const activePolicies = existingPolicies.filter(p => p.status.isActive());
    
    for (const active of activePolicies) {
      if (validityPeriod.overlaps(active.validityPeriod)) {
        throw new Error('Reward policies may not have overlapping validity periods');
      }
    }

    const policy: IRewardPolicy = {
      id,
      restaurantId: dto.restaurantId,
      name: dto.name,
      status: new MembershipStatus('Draft'),
      validityPeriod,
      rules: [],
      domainEvents: [new RewardPolicyCreatedEvent(id, dto.restaurantId)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.policyRepo.save(policy);
    return policy;
  }

  async addRule(policyId: string, dto: RewardRuleDto): Promise<IRewardPolicy> {
    const policy = await this.policyRepo.findById(policyId);
    if (!policy) throw new Error('Policy not found');
    this.ensureNotArchived(policy);

    if (policy.status.isActive()) {
      throw new Error('Reward rules are immutable once a policy is published');
    }

    const errors = validateRewardRule(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const rule: IRewardRule = {
      id: this.generateId(),
      rewardType: new RewardType(dto.rewardType as RewardTypeValue),
      triggerType: dto.triggerType,
      rewardValue: dto.rewardValue,
      conditions: { ...dto.conditions }
    };

    policy.rules.push(rule);
    policy.updatedAt = new Date();
    
    policy.domainEvents = policy.domainEvents || [];
    policy.domainEvents.push(new RewardRuleUpdatedEvent(policy.id, rule.id));

    await this.policyRepo.save(policy);
    return policy;
  }

  async publishPolicy(policyId: string): Promise<IRewardPolicy> {
    const policy = await this.policyRepo.findById(policyId);
    if (!policy) throw new Error('Policy not found');
    this.ensureNotArchived(policy);

    const existingPolicies = await this.policyRepo.findByRestaurantId(policy.restaurantId);
    const activePolicies = existingPolicies.filter(p => p.status.isActive() && p.id !== policy.id);
    
    for (const active of activePolicies) {
      if (policy.validityPeriod.overlaps(active.validityPeriod)) {
        throw new Error('Reward policies may not have overlapping validity periods');
      }
    }

    policy.status = new MembershipStatus('Active'); // active == published
    policy.updatedAt = new Date();

    policy.domainEvents = policy.domainEvents || [];
    policy.domainEvents.push(new RewardPolicyPublishedEvent(policy.id, policy.restaurantId));

    await this.policyRepo.save(policy);
    return policy;
  }

  async archivePolicy(policyId: string): Promise<IRewardPolicy> {
    const policy = await this.policyRepo.findById(policyId);
    if (!policy) throw new Error('Policy not found');

    if (!policy.status.isArchived()) {
      policy.status = new MembershipStatus('Archived');
      policy.updatedAt = new Date();
      await this.policyRepo.save(policy);
    }
    
    return policy;
  }
}
