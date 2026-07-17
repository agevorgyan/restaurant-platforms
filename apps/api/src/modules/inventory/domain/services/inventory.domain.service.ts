import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IInventoryRepository } from '../repositories/inventory.repository.interface';
import { CreateInventoryDto, UpdateInventoryDto } from '../../application/dto/inventory.dto';
import { validateCreateInventory, validateUpdateInventory } from '../../application/validation/inventory.schema';
import { IInventory } from '../entities/inventory.interface';
import { InventoryStatus } from '../value-objects/inventory-status.value-object';
import { InventoryType } from '../value-objects/inventory-type.value-object';
import { InventoryLocation } from '../value-objects/inventory-location.value-object';
import { InventoryCapacity } from '../value-objects/inventory-capacity.value-object';
import {
  InventoryCreatedEvent,
  InventoryUpdatedEvent,
  InventoryActivatedEvent,
  InventoryDeactivatedEvent
} from '../events/inventory.events';

@Injectable()
export class InventoryDomainService {
  constructor(private readonly repository: IInventoryRepository) {}

  public async createInventory(id: string, dto: CreateInventoryDto): Promise<IInventory> {
    const errors = validateCreateInventory(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const existing = await this.repository.findByCodeAndRestaurantId(dto.code, dto.restaurantId);
    if (existing) {
      throw new ConflictException(`Inventory code '${dto.code}' already exists in this restaurant`);
    }

    const inventory: IInventory = {
      id,
      restaurantId: dto.restaurantId,
      branchId: dto.branchId,
      name: dto.name,
      code: dto.code,
      type: new InventoryType(dto.type as any),
      status: new InventoryStatus('Inactive'), // Initially inactive
      location: new InventoryLocation(dto.location),
      capacity: new InventoryCapacity(dto.capacity),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(inventory);
    new InventoryCreatedEvent(inventory.id, inventory.restaurantId);
    return inventory;
  }

  public async updateInventory(id: string, dto: UpdateInventoryDto): Promise<IInventory> {
    const errors = validateUpdateInventory(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const inventory = await this.getInventory(id);

    if (inventory.status.isArchived()) {
      throw new ConflictException('Archived inventories are read-only');
    }

    if (dto.name !== undefined) {
      inventory.name = dto.name;
    }
    if (dto.capacity !== undefined) {
      inventory.capacity = new InventoryCapacity(dto.capacity);
    }

    inventory.updatedAt = new Date();
    await this.repository.save(inventory);
    new InventoryUpdatedEvent(inventory.id, inventory.restaurantId);

    return inventory;
  }

  public async activateInventory(id: string): Promise<IInventory> {
    const inventory = await this.getInventory(id);

    if (inventory.status.isArchived()) {
      throw new ConflictException('Cannot activate an archived inventory');
    }

    if (!inventory.status.isActive()) {
      inventory.status = new InventoryStatus('Active');
      inventory.updatedAt = new Date();
      await this.repository.save(inventory);
      new InventoryActivatedEvent(inventory.id, inventory.restaurantId);
    }

    return inventory;
  }

  public async deactivateInventory(id: string): Promise<IInventory> {
    const inventory = await this.getInventory(id);

    if (inventory.status.isArchived()) {
      throw new ConflictException('Cannot deactivate an archived inventory');
    }

    if (inventory.status.isActive()) {
      inventory.status = new InventoryStatus('Inactive');
      inventory.updatedAt = new Date();
      await this.repository.save(inventory);
      new InventoryDeactivatedEvent(inventory.id, inventory.restaurantId);
    }

    return inventory;
  }

  public async archiveInventory(id: string): Promise<IInventory> {
    const inventory = await this.getInventory(id);

    if (!inventory.status.isArchived()) {
      inventory.status = new InventoryStatus('Archived');
      inventory.updatedAt = new Date();
      await this.repository.save(inventory);
    }

    return inventory;
  }

  public async acceptStock(id: string): Promise<void> {
    const inventory = await this.getInventory(id);
    if (!inventory.status.isActive()) {
      throw new ConflictException('Only Active inventories may accept stock');
    }
  }

  private async getInventory(id: string): Promise<IInventory> {
    const inventory = await this.repository.findById(id);
    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }
}
