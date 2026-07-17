import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IRecipeRepository } from '../repositories/recipe.repository.interface';
import { CreateRecipeDto, UpdateRecipeDto, RecipeIngredientDto } from '../../application/dto/recipe.dto';
import { validateCreateRecipe, validateUpdateRecipe } from '../../application/validation/recipe.schema';
import { IRecipe } from '../entities/recipe.interface';
import { IRecipeIngredient } from '../entities/recipe-ingredient.interface';
import { RecipeVersion } from '../value-objects/recipe-version.value-object';
import { RecipeYield } from '../value-objects/recipe-yield.value-object';
import { PortionSize } from '../value-objects/portion-size.value-object';
import { RecipeStatus } from '../value-objects/recipe-status.value-object';
import { IngredientQuantity } from '../value-objects/ingredient-quantity.value-object';
import { WasteFactor } from '../value-objects/waste-factor.value-object';
import {
  RecipeCreatedEvent,
  RecipeUpdatedEvent,
  RecipeActivatedEvent,
  RecipeArchivedEvent
} from '../events/recipe.events';

@Injectable()
export class RecipeDomainService {
  constructor(private readonly repository: IRecipeRepository) {}

  private mapIngredients(dtos: RecipeIngredientDto[]): IRecipeIngredient[] {
    return dtos.map(dto => ({
      ingredientId: dto.ingredientId,
      quantity: new IngredientQuantity(dto.quantity),
      unitOfMeasure: dto.unitOfMeasure, // Assuming primitive validation for matching
      wasteFactor: new WasteFactor(dto.wasteFactor),
      optional: dto.optional,
      substituteIngredientIds: dto.substituteIngredientIds
    }));
  }

  public async createRecipe(id: string, dto: CreateRecipeDto): Promise<IRecipe> {
    const errors = validateCreateRecipe(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const recipe: IRecipe = {
      id,
      restaurantId: dto.restaurantId,
      menuItemId: dto.menuItemId,
      name: dto.name,
      version: new RecipeVersion(1, 0), // Starts at version 1.0
      yield: new RecipeYield(dto.yieldAmount, dto.yieldUnit),
      portionSize: new PortionSize(dto.portionSizeValue, dto.portionSizeUnit),
      status: new RecipeStatus('Draft'),
      ingredients: this.mapIngredients(dto.ingredients),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(recipe);
    new RecipeCreatedEvent(recipe.id, recipe.restaurantId);
    return recipe;
  }

  public async updateRecipe(id: string, dto: UpdateRecipeDto): Promise<IRecipe> {
    const errors = validateUpdateRecipe(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const recipe = await this.getRecipe(id);

    if (recipe.status.isArchived()) {
      throw new ConflictException('Archived recipes are read-only');
    }

    // Auto-increment minor version on update
    recipe.version = recipe.version.incrementMinor();

    if (dto.name !== undefined) recipe.name = dto.name;
    
    if (dto.yieldAmount !== undefined || dto.yieldUnit !== undefined) {
      recipe.yield = new RecipeYield(
        dto.yieldAmount ?? recipe.yield.amount, 
        dto.yieldUnit ?? recipe.yield.unit
      );
    }

    if (dto.portionSizeValue !== undefined || dto.portionSizeUnit !== undefined) {
      recipe.portionSize = new PortionSize(
        dto.portionSizeValue ?? recipe.portionSize.value, 
        dto.portionSizeUnit ?? recipe.portionSize.unit
      );
    }

    if (dto.ingredients !== undefined) {
      recipe.ingredients = this.mapIngredients(dto.ingredients);
    }

    recipe.updatedAt = new Date();
    await this.repository.save(recipe);
    new RecipeUpdatedEvent(recipe.id, recipe.restaurantId);

    return recipe;
  }

  public async activateRecipe(id: string): Promise<IRecipe> {
    const recipe = await this.getRecipe(id);

    if (recipe.status.isArchived()) {
      throw new ConflictException('Cannot activate an archived recipe');
    }

    if (!recipe.status.isActive()) {
      // Rule: Only one active recipe version is allowed for a Menu Item
      const activeRecipe = await this.repository.findActiveByMenuItemId(recipe.menuItemId);
      if (activeRecipe && activeRecipe.id !== recipe.id) {
        throw new ConflictException(`Menu item ${recipe.menuItemId} already has an active recipe`);
      }

      recipe.status = new RecipeStatus('Active');
      recipe.updatedAt = new Date();
      await this.repository.save(recipe);
      new RecipeActivatedEvent(recipe.id, recipe.restaurantId);
    }

    return recipe;
  }

  public async archiveRecipe(id: string): Promise<IRecipe> {
    const recipe = await this.getRecipe(id);

    if (!recipe.status.isArchived()) {
      recipe.status = new RecipeStatus('Archived');
      recipe.updatedAt = new Date();
      await this.repository.save(recipe);
      new RecipeArchivedEvent(recipe.id, recipe.restaurantId);
    }

    return recipe;
  }

  public async useForProduction(id: string): Promise<void> {
    const recipe = await this.getRecipe(id);
    if (!recipe.status.isActive()) {
      throw new ConflictException('Only Active recipes may be used for production');
    }
  }

  private async getRecipe(id: string): Promise<IRecipe> {
    const recipe = await this.repository.findById(id);
    if (!recipe) throw new NotFoundException('Recipe not found');
    return recipe;
  }
}
