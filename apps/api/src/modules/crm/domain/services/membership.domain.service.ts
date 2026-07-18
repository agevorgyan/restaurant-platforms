import { IMembershipProgram } from '../entities/membership-program.interface';
import { IMembershipTier } from '../entities/membership-tier.interface';
import { IQualificationRule } from '../entities/qualification-rule.interface';
import { IMembershipProgramRepository } from '../repositories/membership-program.repository.interface';
import { MembershipStatus } from '../value-objects/membership-status.value-object';
import { MembershipPeriod } from '../value-objects/membership-period.value-object';
import {
  CreateMembershipProgramDto,
  MembershipTierDto,
  QualificationRuleDto
} from '../../application/dto/membership-reward.dto';
import {
  validateCreateMembershipProgram,
  validateMembershipTier,
  validateQualificationRule
} from '../../application/validation/membership-reward.schema';
import {
  MembershipProgramCreatedEvent,
  MembershipProgramActivatedEvent,
  MembershipTierChangedEvent
} from '../events/membership-reward.events';

export class MembershipDomainService {
  constructor(private readonly membershipRepo: IMembershipProgramRepository) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private validateTierRules(tiers: IMembershipTier[]) {
    const priorities = tiers.map(t => t.priority);
    if (new Set(priorities).size !== priorities.length) {
      throw new Error('Tier priorities must be unique');
    }
    
    // Sort by priority ascending and ensure minimumPoints increase
    const sorted = [...tiers].sort((a, b) => a.priority - b.priority);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].minimumPoints <= sorted[i - 1].minimumPoints) {
        throw new Error('Minimum points must increase with tier priority');
      }
    }
  }

  private ensureNotArchived(program: IMembershipProgram) {
    if (program.status.isArchived()) {
      throw new Error('Archived programs are read-only');
    }
  }

  async createProgram(id: string, dto: CreateMembershipProgramDto): Promise<IMembershipProgram> {
    const errors = validateCreateMembershipProgram(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const program: IMembershipProgram = {
      id,
      restaurantId: dto.restaurantId,
      name: dto.name,
      status: new MembershipStatus('Draft'),
      tiers: [],
      qualificationRules: [],
      effectivePeriod: new MembershipPeriod(dto.effectiveStartDate, dto.effectiveEndDate),
      domainEvents: [new MembershipProgramCreatedEvent(id, dto.restaurantId)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.membershipRepo.save(program);
    return program;
  }

  async addTier(programId: string, dto: MembershipTierDto): Promise<IMembershipProgram> {
    const program = await this.membershipRepo.findById(programId);
    if (!program) throw new Error('Program not found');
    this.ensureNotArchived(program);

    const errors = validateMembershipTier(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const newTier: IMembershipTier = {
      id: this.generateId(),
      name: dto.name,
      minimumPoints: dto.minimumPoints,
      benefits: [...dto.benefits],
      priority: dto.priority
    };

    const newTiers = [...program.tiers, newTier];
    this.validateTierRules(newTiers);

    program.tiers = newTiers;
    program.updatedAt = new Date();
    program.domainEvents = program.domainEvents || [];
    program.domainEvents.push(new MembershipTierChangedEvent(program.id, program.restaurantId));

    await this.membershipRepo.save(program);
    return program;
  }

  async updateTier(programId: string, tierId: string, dto: MembershipTierDto): Promise<IMembershipProgram> {
    const program = await this.membershipRepo.findById(programId);
    if (!program) throw new Error('Program not found');
    this.ensureNotArchived(program);

    const tierIndex = program.tiers.findIndex(t => t.id === tierId);
    if (tierIndex === -1) throw new Error('Tier not found');

    const errors = validateMembershipTier(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const updatedTier: IMembershipTier = {
      id: tierId,
      name: dto.name,
      minimumPoints: dto.minimumPoints,
      benefits: [...dto.benefits],
      priority: dto.priority
    };

    const newTiers = [...program.tiers];
    newTiers[tierIndex] = updatedTier;
    this.validateTierRules(newTiers);

    program.tiers = newTiers;
    program.updatedAt = new Date();
    program.domainEvents = program.domainEvents || [];
    program.domainEvents.push(new MembershipTierChangedEvent(program.id, program.restaurantId));

    await this.membershipRepo.save(program);
    return program;
  }

  async addQualificationRule(programId: string, dto: QualificationRuleDto): Promise<IMembershipProgram> {
    const program = await this.membershipRepo.findById(programId);
    if (!program) throw new Error('Program not found');
    this.ensureNotArchived(program);

    const errors = validateQualificationRule(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const rule: IQualificationRule = {
      id: this.generateId(),
      metric: dto.metric,
      operator: dto.operator,
      value: dto.value
    };

    program.qualificationRules.push(rule);
    program.updatedAt = new Date();
    
    await this.membershipRepo.save(program);
    return program;
  }

  async activateProgram(programId: string): Promise<IMembershipProgram> {
    const program = await this.membershipRepo.findById(programId);
    if (!program) throw new Error('Program not found');
    this.ensureNotArchived(program);

    const activeProgram = await this.membershipRepo.findActiveByRestaurantId(program.restaurantId);
    if (activeProgram && activeProgram.id !== program.id) {
      throw new Error('Only one active membership program is allowed per restaurant');
    }

    program.status = new MembershipStatus('Active');
    program.updatedAt = new Date();
    program.domainEvents = program.domainEvents || [];
    program.domainEvents.push(new MembershipProgramActivatedEvent(program.id, program.restaurantId));

    await this.membershipRepo.save(program);
    return program;
  }

  async deactivateProgram(programId: string): Promise<IMembershipProgram> {
    const program = await this.membershipRepo.findById(programId);
    if (!program) throw new Error('Program not found');
    this.ensureNotArchived(program);

    program.status = new MembershipStatus('Inactive');
    program.updatedAt = new Date();

    await this.membershipRepo.save(program);
    return program;
  }

  async archiveProgram(programId: string): Promise<IMembershipProgram> {
    const program = await this.membershipRepo.findById(programId);
    if (!program) throw new Error('Program not found');

    if (!program.status.isArchived()) {
      program.status = new MembershipStatus('Archived');
      program.updatedAt = new Date();
      await this.membershipRepo.save(program);
    }
    
    return program;
  }
}
