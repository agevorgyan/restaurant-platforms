import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IModifierGroupRepository } from '../../domain/repositories/modifier-group.repository.interface';
import { IModifierGroup } from '../../domain/entities/modifier-group.interface';
import { ModifierGroupStatus, ModifierGroupStatusType } from '../../domain/value-objects/modifier-group-status.value-object';
import { ModifierSelectionRules, ModifierSelectionType } from '../../domain/value-objects/modifier-selection-rules.value-object';
import { CreateModifierGroupDto, UpdateModifierGroupDto } from '../dto/modifier-group.dto';
import { validateCreateModifierGroup, validateUpdateModifierGroup } from '../validation/modifier-group.schema';
import { ModifierGroupCreatedEvent, ModifierGroupUpdatedEvent, ModifierGroupArchivedEvent } from '../../domain/events/modifier-group.events';

@Injectable()
export class ModifierGroupService {
  constructor(
    @Inject('IModifierGroupRepository') private readonly repository: IModifierGroupRepository,
  ) {}

  async create(dto: CreateModifierGroupDto): Promise<IModifierGroup> {
    const errors = validateCreateModifierGroup(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const status = new ModifierGroupStatus((dto.status as ModifierGroupStatusType) || 'Draft');
    const selectionRules = new ModifierSelectionRules(
      dto.selectionType as ModifierSelectionType,
      dto.minimumSelections,
      dto.maximumSelections,
      dto.isRequired,
      dto.allowMultipleSelections
    );

    const modifierGroup: IModifierGroup = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      menuId: dto.menuId,
      name: dto.name,
      description: dto.description,
      displayName: dto.displayName,
      sortOrder: dto.sortOrder,
      status,
      selectionRules,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(modifierGroup);
    new ModifierGroupCreatedEvent(created);
    return created;
  }

  async update(id: string, dto: UpdateModifierGroupDto): Promise<IModifierGroup> {
    const errors = validateUpdateModifierGroup(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const modifierGroup = await this.repository.findById(id);
    if (!modifierGroup) {
      throw new NotFoundException(`Modifier Group with ID ${id} not found`);
    }

    const updates: Partial<IModifierGroup> = { updatedAt: new Date() };
    const newStatus = dto.status ? new ModifierGroupStatus(dto.status as ModifierGroupStatusType) : modifierGroup.status;

    // Rule: Archived modifier groups cannot be assigned to products.
    if (newStatus.isArchived() && !modifierGroup.status.isArchived()) {
      const isAssigned = await this.repository.isAssignedToAnyProduct(id);
      if (isAssigned) {
        throw new BadRequestException('Archived modifier groups cannot be assigned to products');
      }
    }

    const isSelectionRulesChanged = 
      dto.selectionType !== undefined || 
      dto.minimumSelections !== undefined || 
      dto.maximumSelections !== undefined || 
      dto.isRequired !== undefined || 
      dto.allowMultipleSelections !== undefined;

    if (isSelectionRulesChanged) {
      const selectionType = dto.selectionType !== undefined ? dto.selectionType : modifierGroup.selectionRules.selectionType;
      const minimumSelections = dto.minimumSelections !== undefined ? dto.minimumSelections : modifierGroup.selectionRules.minimumSelections;
      const maximumSelections = dto.maximumSelections !== undefined ? dto.maximumSelections : modifierGroup.selectionRules.maximumSelections;
      const isRequired = dto.isRequired !== undefined ? dto.isRequired : modifierGroup.selectionRules.isRequired;
      const allowMultipleSelections = dto.allowMultipleSelections !== undefined ? dto.allowMultipleSelections : modifierGroup.selectionRules.allowMultipleSelections;

      updates.selectionRules = new ModifierSelectionRules(
        selectionType as ModifierSelectionType,
        minimumSelections,
        maximumSelections,
        isRequired,
        allowMultipleSelections
      );
    }

    if (dto.status) updates.status = newStatus;
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.displayName !== undefined) updates.displayName = dto.displayName;
    if (dto.sortOrder !== undefined) updates.sortOrder = dto.sortOrder;

    const updated = await this.repository.update(id, updates);
    new ModifierGroupUpdatedEvent(updated);
    
    if (newStatus.isArchived() && !modifierGroup.status.isArchived()) {
      new ModifierGroupArchivedEvent(updated.id, updated.restaurantId);
    }

    return updated;
  }
}
