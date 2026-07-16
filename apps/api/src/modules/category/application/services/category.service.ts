import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { ICategory } from '../../domain/entities/category.interface';
import { CategoryStatus, CategoryStatusType } from '../../domain/value-objects/category-status.value-object';
import { CategoryVisibility, CategoryVisibilityType } from '../../domain/value-objects/category-visibility.value-object';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { validateCreateCategory, validateUpdateCategory } from '../validation/category.schema';
import { CategoryCreatedEvent, CategoryUpdatedEvent, CategoryDeletedEvent, CategoryMovedEvent } from '../../domain/events/category.events';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('ICategoryRepository') private readonly repository: ICategoryRepository,
  ) {}

  async create(dto: CreateCategoryDto): Promise<ICategory> {
    const errors = validateCreateCategory(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Business Rule: Slug must be unique within the menu.
    const existingSlug = await this.repository.findBySlug(dto.menuId, dto.slug);
    if (existingSlug) {
      throw new BadRequestException(`Slug '${dto.slug}' is already taken for this menu`);
    }

    // Business Rule: Sort order must be unique among siblings.
    const siblings = await this.repository.findByParentId(dto.menuId, dto.parentCategoryId);
    const sortOrderTaken = siblings.some(s => s.sortOrder === dto.sortOrder);
    if (sortOrderTaken) {
      throw new BadRequestException(`Sort order ${dto.sortOrder} is already taken among siblings`);
    }

    // Business Rule: Maximum nesting depth is 3.
    if (dto.parentCategoryId) {
      const parent = await this.repository.findById(dto.parentCategoryId);
      if (!parent) {
        throw new NotFoundException(`Parent category ${dto.parentCategoryId} not found`);
      }
      const ancestors = await this.repository.getAncestors(dto.parentCategoryId);
      // Ancestors list includes the parent itself.
      // If root -> ancestors=1. If child -> ancestors=2.
      // Max depth is 3. So new category will be at depth (ancestors.length + 1).
      // If ancestors.length >= 3, then new depth >= 4, which is invalid.
      if (ancestors.length >= 3) {
        throw new BadRequestException('Maximum nesting depth of 3 exceeded');
      }
    }

    const status = new CategoryStatus('Active');
    const visibility = new CategoryVisibility((dto.visibility as CategoryVisibilityType) || 'Hidden');

    const category: ICategory = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      menuId: dto.menuId,
      parentCategoryId: dto.parentCategoryId,
      name: dto.name,
      description: dto.description,
      slug: dto.slug,
      imageUrl: dto.imageUrl,
      icon: dto.icon,
      sortOrder: dto.sortOrder,
      status,
      visibility,
      seoTitle: dto.seoTitle,
      seoDescription: dto.seoDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(category);
    new CategoryCreatedEvent(created);
    return created;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<ICategory> {
    const errors = validateUpdateCategory(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const category = await this.repository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const updates: Partial<ICategory> = { updatedAt: new Date() };

    // Check slug uniqueness if changed
    if (dto.slug && dto.slug !== category.slug) {
      const existingSlug = await this.repository.findBySlug(category.menuId, dto.slug);
      if (existingSlug) {
        throw new BadRequestException(`Slug '${dto.slug}' is already taken for this menu`);
      }
      updates.slug = dto.slug;
    }

    // Check sort order or parent category movement
    const isParentChanged = dto.parentCategoryId !== undefined && dto.parentCategoryId !== category.parentCategoryId;
    const isSortChanged = dto.sortOrder !== undefined && dto.sortOrder !== category.sortOrder;

    if (isParentChanged || isSortChanged) {
      const newParentId = isParentChanged ? dto.parentCategoryId : category.parentCategoryId;
      const newSortOrder = isSortChanged ? dto.sortOrder! : category.sortOrder;
      
      const siblings = await this.repository.findByParentId(category.menuId, newParentId);
      const sortOrderTaken = siblings.some(s => s.sortOrder === newSortOrder && s.id !== id);
      if (sortOrderTaken) {
        throw new BadRequestException(`Sort order ${newSortOrder} is already taken among siblings`);
      }

      if (isParentChanged && newParentId) {
        const ancestors = await this.repository.getAncestors(newParentId);
        // Ensure new tree depth doesn't exceed 3
        if (ancestors.length >= 3) {
          throw new BadRequestException('Maximum nesting depth of 3 exceeded');
        }
      }

      if (isParentChanged) updates.parentCategoryId = dto.parentCategoryId;
      if (isSortChanged) updates.sortOrder = dto.sortOrder;
    }

    if (dto.status) {
      const newStatus = new CategoryStatus(dto.status as CategoryStatusType);
      
      // Business Rule: Archived categories cannot contain active products.
      if (newStatus.isArchived() && !category.status.isArchived()) {
        const hasActiveProducts = await this.repository.hasActiveProducts(id);
        if (hasActiveProducts) {
          throw new BadRequestException('Archived categories cannot contain active products');
        }
      }
      updates.status = newStatus;
    }

    if (dto.visibility) updates.visibility = new CategoryVisibility(dto.visibility as CategoryVisibilityType);
    if (dto.name) updates.name = dto.name;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.imageUrl !== undefined) updates.imageUrl = dto.imageUrl;
    if (dto.icon !== undefined) updates.icon = dto.icon;
    if (dto.seoTitle !== undefined) updates.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined) updates.seoDescription = dto.seoDescription;

    const updated = await this.repository.update(id, updates);
    new CategoryUpdatedEvent(updated);

    if (isParentChanged || isSortChanged) {
      new CategoryMovedEvent(id, updated.parentCategoryId, updated.sortOrder);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.repository.delete(id);
    new CategoryDeletedEvent(id, category.menuId);
  }
}
