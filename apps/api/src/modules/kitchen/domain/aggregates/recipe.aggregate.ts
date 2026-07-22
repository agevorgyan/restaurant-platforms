import { AggregateRoot } from '@saas/core';
import { RecipeName } from '../value-objects/recipe-name.value-object';
import { RecipeDescription } from '../value-objects/recipe-description.value-object';
import { RecipeCode } from '../value-objects/recipe-code.value-object';
import { RecipeStatus, RecipeStatusEnum } from '../value-objects/recipe-status.value-object';
import { RecipeVersion } from '../value-objects/recipe-version.value-object';
import { RecipeIngredient } from '../entities/recipe-ingredient.entity';
import { RecipeStep } from '../entities/recipe-step.entity';
import { RecipeYield } from '../entities/recipe-yield.entity';
import { RecipeVersionHistory } from '../entities/recipe-version-history.entity';
import { RecipeDomainError } from '../errors/recipe.domain-error';
import {
  RecipeCreatedEvent,
  RecipeUpdatedEvent,
  RecipeActivatedEvent,
  RecipeArchivedEvent,
  RecipeIngredientAddedEvent,
  RecipeIngredientRemovedEvent,
  RecipeStepAddedEvent,
  RecipeStepUpdatedEvent,
} from '../events/recipe.events';
import { RecipeIngredientSpecification, RecipeStepSpecification } from '../specifications/recipe.specification';
import { RecipeValidationPolicy, RecipeLifecyclePolicy } from '../policies/recipe.policy';

export interface RecipeProps {
  id: string;
  restaurantId: string;
  code: RecipeCode;
  name: RecipeName;
  description: RecipeDescription;
  status: RecipeStatus;
  version: RecipeVersion;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  yields: RecipeYield[];
  versionHistory: RecipeVersionHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export class Recipe extends AggregateRoot<RecipeProps> {
  get id(): string {
    return this._id;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get code(): RecipeCode {
    return this.props.code;
  }

  get name(): RecipeName {
    return this.props.name;
  }

  get description(): RecipeDescription {
    return this.props.description;
  }

  get status(): RecipeStatus {
    return this.props.status;
  }

  get version(): RecipeVersion {
    return this.props.version;
  }

  get ingredients(): RecipeIngredient[] {
    return [...this.props.ingredients];
  }

  get steps(): RecipeStep[] {
    return [...this.props.steps].sort((a, b) => a.stepNumber - b.stepNumber);
  }

  get yields(): RecipeYield[] {
    return [...this.props.yields];
  }

  get versionHistory(): RecipeVersionHistory[] {
    return [...this.props.versionHistory];
  }

  private constructor(id: string, props: RecipeProps) {
    super(id, props);
  }

  public static create(
    id: string,
    restaurantId: string,
    code: RecipeCode,
    name: RecipeName,
    description: RecipeDescription
  ): Recipe {
    const recipe = new Recipe(id, {
      id,
      restaurantId,
      code,
      name,
      description,
      status: RecipeStatus.create(RecipeStatusEnum.DRAFT),
      version: RecipeVersion.create(1),
      ingredients: [],
      steps: [],
      yields: [],
      versionHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    RecipeValidationPolicy.validate(recipe.status.value, recipe.props.ingredients, recipe.props.steps);

    recipe.addDomainEvent(
      new RecipeCreatedEvent(recipe.id, recipe.code.value, recipe.restaurantId)
    );

    return recipe;
  }

  public addIngredient(ingredient: RecipeIngredient): void {
    if (!this.status.isDraft()) {
      throw new RecipeDomainError('Cannot add ingredients to a non-draft recipe');
    }

    if (!RecipeIngredientSpecification.isSatisfiedBy(this.props.ingredients, ingredient)) {
      throw new RecipeDomainError(`Ingredient ${ingredient.ingredient.externalId} already exists in the recipe`);
    }

    this.props.ingredients.push(ingredient);
    this.updateModificationDate();

    this.addDomainEvent(
      new RecipeIngredientAddedEvent(this.id, ingredient.id, ingredient.ingredient.externalId)
    );
  }

  public removeIngredient(ingredientId: string): void {
    if (!this.status.isDraft()) {
      throw new RecipeDomainError('Cannot remove ingredients from a non-draft recipe');
    }

    const index = this.props.ingredients.findIndex((i) => i.id === ingredientId);
    if (index === -1) {
      throw new RecipeDomainError(`Ingredient ${ingredientId} not found in recipe`);
    }

    this.props.ingredients.splice(index, 1);
    this.updateModificationDate();

    this.addDomainEvent(new RecipeIngredientRemovedEvent(this.id, ingredientId));
  }

  public addStep(step: RecipeStep): void {
    if (!this.status.isDraft()) {
      throw new RecipeDomainError('Cannot add steps to a non-draft recipe');
    }

    if (!RecipeStepSpecification.isSatisfiedBy(this.props.steps, step)) {
      throw new RecipeDomainError(`Step number ${step.stepNumber} already exists`);
    }

    this.props.steps.push(step);
    this.updateModificationDate();

    this.addDomainEvent(new RecipeStepAddedEvent(this.id, step.id, step.stepNumber));
  }

  public updateStepInstruction(stepId: string, instruction: string): void {
    if (!this.status.isDraft()) {
      throw new RecipeDomainError('Cannot update steps in a non-draft recipe');
    }

    const step = this.props.steps.find((s) => s.id === stepId);
    if (!step) {
      throw new RecipeDomainError(`Step ${stepId} not found in recipe`);
    }

    step.updateInstruction(instruction);
    this.updateModificationDate();

    this.addDomainEvent(new RecipeStepUpdatedEvent(this.id, step.id, step.stepNumber));
  }

  public addYield(recipeYield: RecipeYield): void {
    if (!this.status.isDraft()) {
      throw new RecipeDomainError('Cannot modify yields in a non-draft recipe');
    }

    this.props.yields.push(recipeYield);
    this.updateModificationDate();
  }

  public activate(): void {
    if (!this.status.canTransitionTo(RecipeStatusEnum.ACTIVE)) {
      throw new RecipeDomainError(`Cannot activate recipe from status ${this.status.value}`);
    }

    RecipeLifecyclePolicy.canActivate(this.props.ingredients, this.props.steps);

    this.props.status = RecipeStatus.create(RecipeStatusEnum.ACTIVE);
    this.updateModificationDate();

    this.addDomainEvent(new RecipeActivatedEvent(this.id));
  }

  public archive(): void {
    if (!this.status.canTransitionTo(RecipeStatusEnum.ARCHIVED)) {
      throw new RecipeDomainError(`Cannot archive recipe from status ${this.status.value}`);
    }

    this.props.status = RecipeStatus.create(RecipeStatusEnum.ARCHIVED);
    this.updateModificationDate();

    this.addDomainEvent(new RecipeArchivedEvent(this.id));
  }

  public createNewVersion(historyEntry: RecipeVersionHistory): void {
    if (this.status.isArchived()) {
      throw new RecipeDomainError('Cannot version an archived recipe');
    }

    this.props.versionHistory.push(historyEntry);
    this.props.version = this.props.version.increment();
    this.props.status = RecipeStatus.create(RecipeStatusEnum.DRAFT);
    this.updateModificationDate();

    this.addDomainEvent(new RecipeUpdatedEvent(this.id, this.props.version.version));
  }

  private updateModificationDate(): void {
    this.props.updatedAt = new Date();
  }
}
