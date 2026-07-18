import { ICustomerSegment } from '../entities/customer-segment.interface';
import { ISegmentRule } from '../entities/segment-rule.interface';
import { ICustomerSegmentRepository } from '../repositories/customer-segment.repository.interface';
import { SegmentStatus } from '../value-objects/segment-status.value-object';
import { SegmentType, SegmentTypeValue } from '../value-objects/segment-type.value-object';
import { SegmentPriority } from '../value-objects/segment-priority.value-object';
import { SegmentEvaluationPolicy, SegmentEvaluationPolicyValue } from '../value-objects/segment-evaluation-policy.value-object';
import { SegmentRuleOperator, SegmentRuleOperatorValue } from '../value-objects/segment-rule-operator.value-object';
import { CreateCustomerSegmentDto, UpdateCustomerSegmentDto, SegmentRuleDto } from '../../application/dto/customer-segment.dto';
import { validateCreateCustomerSegment, validateSegmentRule } from '../../application/validation/customer-segment.schema';
import {
  CustomerSegmentCreatedEvent,
  CustomerSegmentUpdatedEvent,
  CustomerSegmentActivatedEvent,
  CustomerSegmentArchivedEvent
} from '../events/customer-segment.events';

export class CustomerSegmentDomainService {
  constructor(private readonly segmentRepo: ICustomerSegmentRepository) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private ensureNotArchived(segment: ICustomerSegment) {
    if (segment.status.isArchived()) {
      throw new Error('Archived segments are read-only');
    }
  }

  private validateRuleUniqueness(rules: ISegmentRule[]) {
    const orders = rules.map(r => r.order);
    if (new Set(orders).size !== orders.length) {
      throw new Error('Rule order must be unique within the segment');
    }
    if (rules.length === 0) {
      throw new Error('Segment must contain at least one rule');
    }
  }

  async createSegment(id: string, dto: CreateCustomerSegmentDto): Promise<ICustomerSegment> {
    const errors = validateCreateCustomerSegment(dto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const existing = await this.segmentRepo.findByName(dto.restaurantId, dto.name);
    if (existing) throw new Error('Segment name must be unique within the restaurant');

    const rules: ISegmentRule[] = dto.rules.map(r => ({
      id: this.generateId(),
      field: r.field,
      operator: new SegmentRuleOperator(r.operator as SegmentRuleOperatorValue),
      value: r.value,
      logicalOperator: r.logicalOperator,
      order: r.order
    }));

    this.validateRuleUniqueness(rules);

    const segment: ICustomerSegment = {
      id,
      restaurantId: dto.restaurantId,
      name: dto.name,
      description: dto.description,
      segmentType: new SegmentType(dto.segmentType as SegmentTypeValue),
      status: new SegmentStatus('Draft'),
      priority: new SegmentPriority(dto.priority),
      evaluationPolicy: new SegmentEvaluationPolicy(dto.evaluationPolicy as SegmentEvaluationPolicyValue),
      rules,
      domainEvents: [new CustomerSegmentCreatedEvent(id, dto.restaurantId)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.segmentRepo.save(segment);
    return segment;
  }

  async updateSegment(id: string, dto: UpdateCustomerSegmentDto): Promise<ICustomerSegment> {
    const segment = await this.segmentRepo.findById(id);
    if (!segment) throw new Error('Segment not found');
    this.ensureNotArchived(segment);

    if (dto.name && dto.name !== segment.name) {
      const existing = await this.segmentRepo.findByName(segment.restaurantId, dto.name);
      if (existing) throw new Error('Segment name must be unique within the restaurant');
      segment.name = dto.name;
    }
    if (dto.description !== undefined) segment.description = dto.description;
    if (dto.priority !== undefined) segment.priority = new SegmentPriority(dto.priority);
    if (dto.evaluationPolicy !== undefined) segment.evaluationPolicy = new SegmentEvaluationPolicy(dto.evaluationPolicy as SegmentEvaluationPolicyValue);

    segment.updatedAt = new Date();
    segment.domainEvents = segment.domainEvents || [];
    segment.domainEvents.push(new CustomerSegmentUpdatedEvent(segment.id, segment.restaurantId));

    await this.segmentRepo.save(segment);
    return segment;
  }

  async addRule(segmentId: string, ruleDto: SegmentRuleDto): Promise<ICustomerSegment> {
    const segment = await this.segmentRepo.findById(segmentId);
    if (!segment) throw new Error('Segment not found');
    this.ensureNotArchived(segment);

    const errors = validateSegmentRule(ruleDto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const newRule: ISegmentRule = {
      id: this.generateId(),
      field: ruleDto.field,
      operator: new SegmentRuleOperator(ruleDto.operator as SegmentRuleOperatorValue),
      value: ruleDto.value,
      logicalOperator: ruleDto.logicalOperator,
      order: ruleDto.order
    };

    const newRules = [...segment.rules, newRule];
    this.validateRuleUniqueness(newRules);

    segment.rules = newRules;
    segment.updatedAt = new Date();
    segment.domainEvents = segment.domainEvents || [];
    segment.domainEvents.push(new CustomerSegmentUpdatedEvent(segment.id, segment.restaurantId));

    await this.segmentRepo.save(segment);
    return segment;
  }

  async updateRule(segmentId: string, ruleId: string, ruleDto: SegmentRuleDto): Promise<ICustomerSegment> {
    const segment = await this.segmentRepo.findById(segmentId);
    if (!segment) throw new Error('Segment not found');
    this.ensureNotArchived(segment);

    const ruleIndex = segment.rules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) throw new Error('Rule not found');

    const errors = validateSegmentRule(ruleDto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

    const updatedRule: ISegmentRule = {
      id: ruleId,
      field: ruleDto.field,
      operator: new SegmentRuleOperator(ruleDto.operator as SegmentRuleOperatorValue),
      value: ruleDto.value,
      logicalOperator: ruleDto.logicalOperator,
      order: ruleDto.order
    };

    const newRules = [...segment.rules];
    newRules[ruleIndex] = updatedRule;
    this.validateRuleUniqueness(newRules);

    segment.rules = newRules;
    segment.updatedAt = new Date();
    segment.domainEvents = segment.domainEvents || [];
    segment.domainEvents.push(new CustomerSegmentUpdatedEvent(segment.id, segment.restaurantId));

    await this.segmentRepo.save(segment);
    return segment;
  }

  async removeRule(segmentId: string, ruleId: string): Promise<ICustomerSegment> {
    const segment = await this.segmentRepo.findById(segmentId);
    if (!segment) throw new Error('Segment not found');
    this.ensureNotArchived(segment);

    const newRules = segment.rules.filter(r => r.id !== ruleId);
    this.validateRuleUniqueness(newRules);

    segment.rules = newRules;
    segment.updatedAt = new Date();
    segment.domainEvents = segment.domainEvents || [];
    segment.domainEvents.push(new CustomerSegmentUpdatedEvent(segment.id, segment.restaurantId));

    await this.segmentRepo.save(segment);
    return segment;
  }

  async activateSegment(segmentId: string): Promise<ICustomerSegment> {
    const segment = await this.segmentRepo.findById(segmentId);
    if (!segment) throw new Error('Segment not found');
    this.ensureNotArchived(segment);

    segment.status = new SegmentStatus('Active');
    segment.updatedAt = new Date();
    segment.domainEvents = segment.domainEvents || [];
    segment.domainEvents.push(new CustomerSegmentActivatedEvent(segment.id, segment.restaurantId));

    await this.segmentRepo.save(segment);
    return segment;
  }

  async deactivateSegment(segmentId: string): Promise<ICustomerSegment> {
    const segment = await this.segmentRepo.findById(segmentId);
    if (!segment) throw new Error('Segment not found');
    this.ensureNotArchived(segment);

    segment.status = new SegmentStatus('Inactive');
    segment.updatedAt = new Date();
    // Reusing the general update event or we could add CustomerSegmentDeactivatedEvent if required. Prompt didn't specify deactivated event explicitly, but requested "Deactivate" behavior.
    segment.domainEvents = segment.domainEvents || [];
    segment.domainEvents.push(new CustomerSegmentUpdatedEvent(segment.id, segment.restaurantId));

    await this.segmentRepo.save(segment);
    return segment;
  }

  async archiveSegment(segmentId: string): Promise<ICustomerSegment> {
    const segment = await this.segmentRepo.findById(segmentId);
    if (!segment) throw new Error('Segment not found');

    if (!segment.status.isArchived()) {
      segment.status = new SegmentStatus('Archived');
      segment.updatedAt = new Date();
      segment.domainEvents = segment.domainEvents || [];
      segment.domainEvents.push(new CustomerSegmentArchivedEvent(segment.id, segment.restaurantId));
      await this.segmentRepo.save(segment);
    }
    return segment;
  }
}
