import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IModifierOptionRepository } from '../../domain/repositories/modifier-option.repository.interface';
import { IModifierOption } from '../../domain/entities/modifier-option.interface';
import { ModifierOptionStatus, ModifierOptionStatusType } from '../../domain/value-objects/modifier-option-status.value-object';
import { ModifierOptionAvailability, ModifierOptionAvailabilityType } from '../../domain/value-objects/modifier-option-availability.value-object';
import { ModifierOptionPrice } from '../../domain/value-objects/modifier-option-price.value-object';
import { CreateModifierOptionDto, UpdateModifierOptionDto } from '../dto/modifier-option.dto';
import { validateCreateModifierOption, validateUpdateModifierOption } from '../validation/modifier-option.schema';
import { ModifierOptionCreatedEvent, ModifierOptionUpdatedEvent, ModifierOptionArchivedEvent } from '../../domain/events/modifier-option.events';

@Injectable()
export class ModifierOptionService {
  constructor(
    @Inject('IModifierOptionRepository') private readonly repository: IModifierOptionRepository,
  ) {}

  async create(dto: CreateModifierOptionDto): Promise<IModifierOption> {
    const errors = validateCreateModifierOption(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    if (dto.sku) {
      const existingSku = await this.repository.findBySku(dto.restaurantId, dto.sku);
      if (existingSku) {
        throw new BadRequestException(`SKU '${dto.sku}' is already taken in this restaurant`);
      }
    }

    if (dto.isDefault) {
      const isSingleSelection = await this.repository.isModifierGroupSingleSelection(dto.modifierGroupId);
      if (isSingleSelection) {
        const existingDefault = await this.repository.findDefaultByModifierGroupId(dto.modifierGroupId);
        if (existingDefault) {
          throw new BadRequestException('Only one default option is allowed for Single selection groups');
        }
      }
    }

    const status = new ModifierOptionStatus((dto.status as ModifierOptionStatusType) || 'Draft');
    const availability = new ModifierOptionAvailability((dto.availability as ModifierOptionAvailabilityType) || 'Hidden');
    const priceDetails = new ModifierOptionPrice(dto.priceAdjustment, dto.currency);

    const modifierOption: IModifierOption = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      menuId: dto.menuId,
      modifierGroupId: dto.modifierGroupId,
      sku: dto.sku,
      name: dto.name,
      description: dto.description,
      sortOrder: dto.sortOrder,
      priceDetails,
      availability,
      status,
      isDefault: dto.isDefault || false,
      maxQuantity: dto.maxQuantity,
      calories: dto.calories,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(modifierOption);
    new ModifierOptionCreatedEvent(created);
    return created;
  }

  async update(id: string, dto: UpdateModifierOptionDto): Promise<IModifierOption> {
    const errors = validateUpdateModifierOption(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const modifierOption = await this.repository.findById(id);
    if (!modifierOption) {
      throw new NotFoundException(`Modifier Option with ID ${id} not found`);
    }

    const updates: Partial<IModifierOption> = { updatedAt: new Date() };

    if (dto.sku && dto.sku !== modifierOption.sku) {
      const existingSku = await this.repository.findBySku(modifierOption.restaurantId, dto.sku);
      if (existingSku) {
        throw new BadRequestException(`SKU '${dto.sku}' is already taken in this restaurant`);
      }
      updates.sku = dto.sku;
    }

    if (dto.isDefault && !modifierOption.isDefault) {
      const isSingleSelection = await this.repository.isModifierGroupSingleSelection(modifierOption.modifierGroupId);
      if (isSingleSelection) {
        const existingDefault = await this.repository.findDefaultByModifierGroupId(modifierOption.modifierGroupId);
        if (existingDefault && existingDefault.id !== id) {
          throw new BadRequestException('Only one default option is allowed for Single selection groups');
        }
      }
      updates.isDefault = true;
    } else if (dto.isDefault === false) {
      updates.isDefault = false;
    }

    const newStatus = dto.status ? new ModifierOptionStatus(dto.status as ModifierOptionStatusType) : modifierOption.status;
    const newAvailability = dto.availability ? new ModifierOptionAvailability(dto.availability as ModifierOptionAvailabilityType) : modifierOption.availability;

    const isPriceChanged = dto.priceAdjustment !== undefined || dto.currency !== undefined;
    if (isPriceChanged) {
      const priceAdj = dto.priceAdjustment !== undefined ? dto.priceAdjustment : modifierOption.priceDetails.priceAdjustment;
      const currency = dto.currency !== undefined ? dto.currency : modifierOption.priceDetails.currency;
      updates.priceDetails = new ModifierOptionPrice(priceAdj, currency);
    }

    if (dto.status) updates.status = newStatus;
    if (dto.availability) updates.availability = newAvailability;
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.sortOrder !== undefined) updates.sortOrder = dto.sortOrder;
    if (dto.maxQuantity !== undefined) updates.maxQuantity = dto.maxQuantity;
    if (dto.calories !== undefined) updates.calories = dto.calories;

    const updated = await this.repository.update(id, updates);
    new ModifierOptionUpdatedEvent(updated);
    
    if (newStatus.isArchived() && !modifierOption.status.isArchived()) {
      new ModifierOptionArchivedEvent(updated.id, updated.restaurantId);
    }

    return updated;
  }
}
