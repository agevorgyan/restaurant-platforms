import { AggregateRoot } from '@saas/core';
import { ProductionNumber } from '../value-objects/production-number.value-object';
import { RecipeReference } from '../value-objects/recipe-reference.value-object';
import { KitchenTicketReference } from '../value-objects/kitchen-ticket-reference.value-object';
import { ProductionType } from '../value-objects/production-type.value-object';
import { ProductionType as ProductionTypeEnum } from '../enums/production-type.enum';
import { ProductionStatus } from '../value-objects/production-status.value-object';
import { ProductionStatus as ProductionStatusEnum } from '../enums/production-status.enum';
import { ProductionPriority } from '../value-objects/production-priority.value-object';
import { ProductionPriority as ProductionPriorityEnum } from '../enums/production-priority.enum';
import { ProductionVersion } from '../value-objects/production-version.value-object';

import { ProductionIngredient } from '../entities/production-ingredient.entity';
import { ProductionOutput } from '../entities/production-output.entity';
import { ProductionStepExecution } from '../entities/production-step-execution.entity';
import { ProductionStationAssignment } from '../entities/production-station-assignment.entity';
import { ProductionQualityCheck } from '../entities/production-quality-check.entity';
import { ProductionTimeline } from '../entities/production-timeline.entity';

import { ProductionValidationPolicy, ProductionExecutionPolicy } from '../policies/production.policy';
import { ProductionLifecycleSpecification } from '../specifications/production.specification';
import { ProductionDomainError } from '../errors/production.domain-error';

import {
  ProductionCreatedEvent,
  ProductionScheduledEvent,
  ProductionStartedEvent,
  ProductionPausedEvent,
  ProductionCompletedEvent,
  ProductionCancelledEvent
} from '../events/production.events';

export interface ProductionProps {
  id: string;
  productionNumber: ProductionNumber;
  recipeReference: RecipeReference;
  productionType: ProductionType;
  kitchenTicketReference?: KitchenTicketReference;
  status: ProductionStatus;
  priority: ProductionPriority;
  version: ProductionVersion;
  ingredients: ProductionIngredient[];
  outputs: ProductionOutput[];
  stepExecutions: ProductionStepExecution[];
  assignments: ProductionStationAssignment[];
  qualityChecks: ProductionQualityCheck[];
  timeline: ProductionTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

export class Production extends AggregateRoot<ProductionProps> {
  get id(): string {
    return this._id;
  }

  get productionNumber(): ProductionNumber {
    return this.props.productionNumber;
  }

  get recipeReference(): RecipeReference {
    return this.props.recipeReference;
  }

  get productionType(): ProductionType {
    return this.props.productionType;
  }

  get status(): ProductionStatus {
    return this.props.status;
  }

  get priority(): ProductionPriority {
    return this.props.priority;
  }

  get ingredients(): ProductionIngredient[] {
    return [...this.props.ingredients];
  }

  get timeline(): ProductionTimeline[] {
    return [...this.props.timeline];
  }

  private constructor(id: string, props: ProductionProps) {
    super(id, props);
  }

  public static create(
    id: string,
    productionNumber: ProductionNumber,
    recipeReference: RecipeReference,
    productionType: ProductionTypeEnum,
    ingredients: ProductionIngredient[],
    kitchenTicketReference?: KitchenTicketReference,
    priority: ProductionPriorityEnum = ProductionPriorityEnum.NORMAL
  ): Production {
    ProductionValidationPolicy.validate(ingredients);

    const production = new Production(id, {
      id,
      productionNumber,
      recipeReference,
      productionType: ProductionType.create(productionType),
      kitchenTicketReference,
      status: ProductionStatus.create(ProductionStatusEnum.PLANNED),
      priority: ProductionPriority.create(priority),
      version: ProductionVersion.create(1),
      ingredients: [...ingredients],
      outputs: [],
      stepExecutions: [],
      assignments: [],
      qualityChecks: [],
      timeline: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    production.recordTimelineEvent(ProductionStatusEnum.PLANNED, 'SYSTEM', 'Production Created');
    production.addDomainEvent(
      new ProductionCreatedEvent(production.id, production.recipeReference.recipeId, production.productionType.value)
    );

    return production;
  }

  public schedule(triggeredBy: string): void {
    this.transitionTo(ProductionStatusEnum.SCHEDULED, triggeredBy);
    this.addDomainEvent(new ProductionScheduledEvent(this.id));
  }

  public startExecution(triggeredBy: string): void {
    if (!ProductionExecutionPolicy.canStartExecution(this.status.value)) {
      throw new ProductionDomainError(`Cannot start execution from status: ${this.status.value}`);
    }

    this.transitionTo(ProductionStatusEnum.IN_PROGRESS, triggeredBy);
    this.addDomainEvent(new ProductionStartedEvent(this.id));
  }

  public pauseExecution(triggeredBy: string, reason: string): void {
    if (!ProductionExecutionPolicy.canPauseExecution(this.status.value)) {
      throw new ProductionDomainError(`Cannot pause execution from status: ${this.status.value}`);
    }

    this.transitionTo(ProductionStatusEnum.PAUSED, triggeredBy, reason);
    this.addDomainEvent(new ProductionPausedEvent(this.id));
  }

  public completeExecution(triggeredBy: string): void {
    if (!ProductionExecutionPolicy.canCompleteExecution(this.status.value)) {
      throw new ProductionDomainError(`Cannot complete execution from status: ${this.status.value}`);
    }

    this.transitionTo(ProductionStatusEnum.COMPLETED, triggeredBy);
    this.addDomainEvent(new ProductionCompletedEvent(this.id));
  }

  public cancel(triggeredBy: string, reason: string): void {
    if (!reason || reason.trim() === '') {
      throw new ProductionDomainError('Cancellation requires a reason');
    }

    this.transitionTo(ProductionStatusEnum.CANCELLED, triggeredBy, reason);
    this.addDomainEvent(new ProductionCancelledEvent(this.id, reason));
  }

  private transitionTo(newStatus: ProductionStatusEnum, triggeredBy: string, reason?: string): void {
    if (!ProductionLifecycleSpecification.canTransition(this.status.value, newStatus)) {
      throw new ProductionDomainError(`Invalid transition from ${this.status.value} to ${newStatus}`);
    }

    this.props.status = ProductionStatus.create(newStatus);
    this.recordTimelineEvent(newStatus, triggeredBy, reason);
    this.incrementVersion();
  }

  private recordTimelineEvent(status: ProductionStatusEnum, triggeredBy: string, reason?: string): void {
    const timelineEvent = ProductionTimeline.create(
      this.generateId(),
      status,
      triggeredBy,
      reason
    );
    this.props.timeline.push(timelineEvent);
  }

  private incrementVersion(): void {
    this.props.version = this.props.version.increment();
    this.props.updatedAt = new Date();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
