import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IKitchenStationRepository } from '../../domain/repositories/kitchen-station.repository.interface';
import { CreateKitchenStationDto, UpdateKitchenStationStatusDto } from '../../application/dto/kitchen-station.dto';
import { validateCreateKitchenStation, validateUpdateKitchenStationStatus } from '../../application/validation/kitchen-station.schema';
import { KitchenStationStatus } from '../../domain/value-objects/kitchen-station-status.value-object';
import { KitchenStationType } from '../../domain/value-objects/kitchen-station-type.value-object';
import { KitchenStationCapacity } from '../../domain/value-objects/kitchen-station-capacity.value-object';
import { IKitchenStation } from '../../domain/entities/kitchen-station.interface';
import {
  KitchenStationCreatedEvent,
  KitchenStationActivatedEvent,
  KitchenStationDeactivatedEvent
} from '../../domain/events/kitchen-station.events';

@Injectable()
export class KitchenStationDomainService {
  constructor(private readonly repository: IKitchenStationRepository) {}

  public async createStation(id: string, dto: CreateKitchenStationDto): Promise<IKitchenStation> {
    const errors = validateCreateKitchenStation(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Business Rule: Station name must be unique within a kitchen
    const existing = await this.repository.findByNameAndKitchenId(dto.name, dto.kitchenId);
    if (existing) {
      throw new ConflictException(`Station name '${dto.name}' already exists in this kitchen`);
    }

    const station: IKitchenStation = {
      id,
      restaurantId: dto.restaurantId,
      branchId: dto.branchId,
      kitchenId: dto.kitchenId,
      name: dto.name,
      stationType: new KitchenStationType(dto.stationType as any),
      status: new KitchenStationStatus('Inactive'), // Created inactive by default
      capacity: new KitchenStationCapacity(dto.capacity),
      displayOrder: dto.displayOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(station);
    new KitchenStationCreatedEvent(station.id, station.kitchenId);
    return station;
  }

  public async updateStatus(id: string, dto: UpdateKitchenStationStatusDto): Promise<IKitchenStation> {
    const errors = validateUpdateKitchenStationStatus(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const station = await this.repository.findById(id);
    if (!station) {
      throw new NotFoundException('Kitchen Station not found');
    }

    const newStatusStr = dto.status;
    station.status = new KitchenStationStatus(newStatusStr as any);
    station.updatedAt = new Date();

    await this.repository.save(station);

    // Domain Events
    if (newStatusStr === 'Active') {
      new KitchenStationActivatedEvent(station.id, station.kitchenId);
    } else if (newStatusStr === 'Inactive' || newStatusStr === 'Maintenance') {
      new KitchenStationDeactivatedEvent(station.id, station.kitchenId);
    }

    return station;
  }
}
