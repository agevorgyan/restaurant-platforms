import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IKitchenRepository } from '../../domain/repositories/kitchen.repository.interface';
import { CreateKitchenDto, UpdateKitchenStatusDto } from '../../application/dto/kitchen.dto';
import { validateCreateKitchen, validateUpdateKitchenStatus } from '../../application/validation/kitchen.schema';
import { KitchenStatus } from '../../domain/value-objects/kitchen-status.value-object';
import { KitchenPriorityMode } from '../../domain/value-objects/kitchen-priority.value-object';
import { IKitchen } from '../../domain/entities/kitchen.interface';
import {
  KitchenCreatedEvent,
  KitchenOpenedEvent,
  KitchenClosedEvent,
  KitchenStatusChangedEvent
} from '../../domain/events/kitchen.events';

@Injectable()
export class KitchenDomainService {
  constructor(private readonly repository: IKitchenRepository) {}

  public async createKitchen(id: string, dto: CreateKitchenDto): Promise<IKitchen> {
    const errors = validateCreateKitchen(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Business Rule: Kitchen name must be unique within a branch
    const existing = await this.repository.findByNameAndBranchId(dto.name, dto.branchId);
    if (existing) {
      throw new ConflictException(`Kitchen name '${dto.name}' already exists in this branch`);
    }

    // Business Rule: Only one kitchen may be marked as default
    if (dto.isDefault) {
      const existingDefault = await this.repository.findDefaultByBranchId(dto.branchId);
      if (existingDefault) {
        throw new ConflictException('A default kitchen already exists for this branch');
      }
    }

    const kitchen: IKitchen = {
      id,
      restaurantId: dto.restaurantId,
      branchId: dto.branchId,
      name: dto.name,
      status: new KitchenStatus('Closed'), // Created closed by default
      priorityMode: new KitchenPriorityMode(dto.priorityMode as any),
      timezone: dto.timezone,
      isDefault: dto.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(kitchen);
    new KitchenCreatedEvent(kitchen.id, kitchen.branchId);
    return kitchen;
  }

  public async updateStatus(id: string, dto: UpdateKitchenStatusDto): Promise<IKitchen> {
    const errors = validateUpdateKitchenStatus(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const kitchen = await this.repository.findById(id);
    if (!kitchen) {
      throw new NotFoundException('Kitchen not found');
    }

    const newStatus = new KitchenStatus(dto.status as any);
    const oldStatusStr = kitchen.status.value;
    const newStatusStr = newStatus.value;

    if (!kitchen.status.canTransitionTo(newStatusStr)) {
      throw new ConflictException(`Cannot transition kitchen from ${oldStatusStr} to ${newStatusStr}`);
    }

    kitchen.status = newStatus;
    kitchen.updatedAt = new Date();

    await this.repository.save(kitchen);

    // Domain Events
    new KitchenStatusChangedEvent(kitchen.id, kitchen.branchId, oldStatusStr, newStatusStr);

    if (newStatusStr === 'Open') {
      new KitchenOpenedEvent(kitchen.id, kitchen.branchId);
    } else if (newStatusStr === 'Closed') {
      new KitchenClosedEvent(kitchen.id, kitchen.branchId);
    }

    return kitchen;
  }
}
