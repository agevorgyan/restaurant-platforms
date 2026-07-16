import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IMenuRepository } from '../../domain/repositories/menu.repository.interface';
import { IMenu } from '../../domain/entities/menu.interface';
import { MenuStatus, MenuStatusType } from '../../domain/value-objects/menu-status.value-object';
import { MenuVisibility, MenuVisibilityType } from '../../domain/value-objects/menu-visibility.value-object';
import { CreateMenuDto, UpdateMenuDto } from '../dto/menu.dto';
import { validateCreateMenu, validateUpdateMenu } from '../validation/menu.schema';
import { MenuCreatedEvent, MenuUpdatedEvent, MenuPublishedEvent, MenuArchivedEvent } from '../../domain/events/menu.events';

@Injectable()
export class MenuService {
  constructor(
    @Inject('IMenuRepository') private readonly repository: IMenuRepository,
  ) {}

  async create(dto: CreateMenuDto): Promise<IMenu> {
    const errors = validateCreateMenu(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Business Rule: Slug must be unique within the restaurant.
    const existingSlug = await this.repository.findBySlug(dto.restaurantId, dto.slug);
    if (existingSlug) {
      throw new BadRequestException(`Slug '${dto.slug}' is already taken for this restaurant`);
    }

    // Business Rule: Only one default menu per branch.
    if (dto.isDefault && dto.branchIds?.length > 0) {
      const defaultMenus = await this.repository.findDefaultMenusByBranchIds(dto.branchIds);
      if (defaultMenus.length > 0) {
        throw new BadRequestException(`One or more of the selected branches already has a default menu`);
      }
    }

    const status = new MenuStatus('Draft');
    const visibility = new MenuVisibility((dto.visibility as MenuVisibilityType) || 'Hidden');

    const menu: IMenu = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      branchIds: dto.branchIds || [],
      name: dto.name,
      description: dto.description || '',
      slug: dto.slug,
      status,
      visibility,
      defaultLanguage: dto.defaultLanguage,
      supportedLanguages: dto.supportedLanguages || [dto.defaultLanguage],
      sortOrder: dto.sortOrder || 0,
      isDefault: dto.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(menu);
    new MenuCreatedEvent(created);
    return created;
  }

  async update(id: string, dto: UpdateMenuDto): Promise<IMenu> {
    const errors = validateUpdateMenu(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const menu = await this.repository.findById(id);
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    const updates: Partial<IMenu> = { updatedAt: new Date() };

    // Business Rule: Slug must be unique within the restaurant.
    if (dto.slug && dto.slug !== menu.slug) {
      const existingSlug = await this.repository.findBySlug(menu.restaurantId, dto.slug);
      if (existingSlug) {
        throw new BadRequestException(`Slug '${dto.slug}' is already taken for this restaurant`);
      }
      updates.slug = dto.slug;
    }

    // Business Rule: Only one default menu per branch.
    if (dto.isDefault && (dto.branchIds || menu.branchIds).length > 0) {
      const branchIdsToCheck = dto.branchIds || menu.branchIds;
      const defaultMenus = await this.repository.findDefaultMenusByBranchIds(branchIdsToCheck);
      // Filter out the current menu from the default menus found
      const otherDefaultMenus = defaultMenus.filter(m => m.id !== id);
      if (otherDefaultMenus.length > 0) {
        throw new BadRequestException(`One or more of the selected branches already has a default menu`);
      }
      updates.isDefault = dto.isDefault;
    }

    if (dto.status) {
      const newStatus = new MenuStatus(dto.status as MenuStatusType);
      
      // Business Rule: Archived menus cannot be published directly. Handled by VO logic.
      if (!menu.status.canTransitionTo(newStatus.value)) {
        throw new BadRequestException(`Cannot transition status from ${menu.status.value} to ${newStatus.value}`);
      }

      updates.status = newStatus;
      
      if (newStatus.value === 'Published') {
        new MenuPublishedEvent(menu.id, menu.restaurantId);
      } else if (newStatus.value === 'Archived') {
        new MenuArchivedEvent(menu.id, menu.restaurantId);
      }
    }

    if (dto.visibility) updates.visibility = new MenuVisibility(dto.visibility as MenuVisibilityType);
    if (dto.name) updates.name = dto.name;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.branchIds) updates.branchIds = dto.branchIds;
    if (dto.supportedLanguages) updates.supportedLanguages = dto.supportedLanguages;
    if (dto.sortOrder !== undefined) updates.sortOrder = dto.sortOrder;
    if (dto.isDefault !== undefined && dto.isDefault === false) updates.isDefault = false;

    const updated = await this.repository.update(id, updates);
    new MenuUpdatedEvent(updated);
    return updated;
  }

  async findByRestaurant(restaurantId: string): Promise<IMenu[]> {
    return this.repository.findByRestaurantId(restaurantId);
  }

  async findById(id: string): Promise<IMenu | null> {
    return this.repository.findById(id);
  }
}
