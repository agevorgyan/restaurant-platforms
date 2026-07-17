import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IIngredientRepository } from '../repositories/ingredient.repository.interface';
import { CreateIngredientDto, UpdateIngredientDto } from '../../application/dto/ingredient.dto';
import { validateCreateIngredient, validateUpdateIngredient } from '../../application/validation/ingredient.schema';
import { IIngredient } from '../entities/ingredient.interface';
import { IngredientCode } from '../value-objects/ingredient-code.value-object';
import { IngredientCategory } from '../value-objects/ingredient-category.value-object';
import { UnitOfMeasure } from '../value-objects/unit-of-measure.value-object';
import { IngredientStatus } from '../value-objects/ingredient-status.value-object';
import { StorageCondition } from '../value-objects/storage-condition.value-object';
import { ShelfLife } from '../value-objects/shelf-life.value-object';
import { AllergenInformation } from '../value-objects/allergen-information.value-object';
import {
  IngredientCreatedEvent,
  IngredientUpdatedEvent,
  IngredientActivatedEvent,
  IngredientArchivedEvent
} from '../events/ingredient.events';

@Injectable()
export class IngredientDomainService {
  constructor(private readonly repository: IIngredientRepository) {}

  public async createIngredient(id: string, dto: CreateIngredientDto): Promise<IIngredient> {
    const errors = validateCreateIngredient(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const existingCode = await this.repository.findByCodeAndRestaurantId(dto.ingredientCode, dto.restaurantId);
    if (existingCode) {
      throw new ConflictException(`Ingredient code '${dto.ingredientCode}' already exists in this restaurant`);
    }

    if (dto.barcode) {
      const existingBarcode = await this.repository.findByBarcode(dto.barcode);
      if (existingBarcode) {
        throw new ConflictException(`Barcode '${dto.barcode}' is already in use`);
      }
    }

    const ingredient: IIngredient = {
      id,
      restaurantId: dto.restaurantId,
      ingredientCode: new IngredientCode(dto.ingredientCode),
      name: dto.name,
      description: dto.description,
      category: new IngredientCategory(dto.category as any),
      unitOfMeasure: new UnitOfMeasure(dto.unitOfMeasure as any),
      status: new IngredientStatus('Draft'), // Initially draft
      defaultStorageCondition: new StorageCondition(dto.defaultStorageCondition as any),
      defaultShelfLife: new ShelfLife(dto.defaultShelfLife),
      allergenInformation: new AllergenInformation(dto.allergens || []),
      barcode: dto.barcode,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(ingredient);
    new IngredientCreatedEvent(ingredient.id, ingredient.restaurantId);
    return ingredient;
  }

  public async updateIngredient(id: string, dto: UpdateIngredientDto): Promise<IIngredient> {
    const errors = validateUpdateIngredient(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const ingredient = await this.getIngredient(id);

    if (ingredient.status.isArchived()) {
      throw new ConflictException('Archived ingredients are read-only');
    }

    if (dto.barcode && dto.barcode !== ingredient.barcode) {
      const existingBarcode = await this.repository.findByBarcode(dto.barcode);
      if (existingBarcode && existingBarcode.id !== id) {
        throw new ConflictException(`Barcode '${dto.barcode}' is already in use`);
      }
      ingredient.barcode = dto.barcode;
    }

    if (dto.name !== undefined) ingredient.name = dto.name;
    if (dto.description !== undefined) ingredient.description = dto.description;
    
    if (dto.category !== undefined) {
      ingredient.category = new IngredientCategory(dto.category as any);
    }
    
    if (dto.defaultStorageCondition !== undefined) {
      ingredient.defaultStorageCondition = new StorageCondition(dto.defaultStorageCondition as any);
    }
    
    if (dto.defaultShelfLife !== undefined) {
      ingredient.defaultShelfLife = new ShelfLife(dto.defaultShelfLife);
    }

    if (dto.allergens !== undefined) {
      ingredient.allergenInformation = new AllergenInformation(dto.allergens);
    }

    ingredient.updatedAt = new Date();
    await this.repository.save(ingredient);
    new IngredientUpdatedEvent(ingredient.id, ingredient.restaurantId);

    return ingredient;
  }

  public async activateIngredient(id: string): Promise<IIngredient> {
    const ingredient = await this.getIngredient(id);

    if (ingredient.status.isArchived()) {
      throw new ConflictException('Cannot activate an archived ingredient');
    }

    if (!ingredient.status.isActive()) {
      ingredient.status = new IngredientStatus('Active');
      ingredient.updatedAt = new Date();
      await this.repository.save(ingredient);
      new IngredientActivatedEvent(ingredient.id, ingredient.restaurantId);
    }

    return ingredient;
  }

  public async archiveIngredient(id: string): Promise<IIngredient> {
    const ingredient = await this.getIngredient(id);

    if (!ingredient.status.isArchived()) {
      ingredient.status = new IngredientStatus('Archived');
      ingredient.updatedAt = new Date();
      await this.repository.save(ingredient);
      new IngredientArchivedEvent(ingredient.id, ingredient.restaurantId);
    }

    return ingredient;
  }

  public async useInRecipe(id: string): Promise<void> {
    const ingredient = await this.getIngredient(id);
    if (!ingredient.status.isActive()) {
      throw new ConflictException('Only Active ingredients can be used in recipes');
    }
  }

  private async getIngredient(id: string): Promise<IIngredient> {
    const ingredient = await this.repository.findById(id);
    if (!ingredient) throw new NotFoundException('Ingredient not found');
    return ingredient;
  }
}
