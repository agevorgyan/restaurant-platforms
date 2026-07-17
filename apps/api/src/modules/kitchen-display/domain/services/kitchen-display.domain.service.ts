import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { IKitchenDisplayRepository } from '../repositories/kitchen-display.repository.interface';
import { CreateKitchenDisplayDto, UpdateKitchenDisplayDto } from '../../application/dto/kitchen-display.dto';
import { validateCreateKitchenDisplay, validateUpdateKitchenDisplay } from '../../application/validation/kitchen-display.schema';
import { IKitchenDisplay } from '../entities/kitchen-display.interface';
import { DisplayLayout } from '../value-objects/display-layout.value-object';
import { DisplayConfiguration } from '../value-objects/display-configuration.value-object';
import { DisplayRefreshPolicy } from '../value-objects/display-refresh-policy.value-object';
import { DisplayFilter } from '../value-objects/display-filter.value-object';
import { DisplayStatus } from '../value-objects/display-status.value-object';
import {
  KitchenDisplayActivatedEvent,
  KitchenDisplayDeactivatedEvent
} from '../events/kitchen-display.events';

@Injectable()
export class KitchenDisplayDomainService {
  constructor(private readonly repository: IKitchenDisplayRepository) {}

  public async createDisplay(id: string, dto: CreateKitchenDisplayDto): Promise<IKitchenDisplay> {
    const errors = validateCreateKitchenDisplay(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const existing = await this.repository.findByNameAndStationId(dto.name, dto.stationId);
    if (existing) {
      throw new ConflictException(`Display name '${dto.name}' is already used in this station`);
    }

    const display: IKitchenDisplay = {
      id,
      restaurantId: dto.restaurantId,
      branchId: dto.branchId,
      kitchenId: dto.kitchenId,
      stationId: dto.stationId,
      name: dto.name,
      layout: new DisplayLayout(dto.layout as any),
      configuration: new DisplayConfiguration(
        dto.configuration.showCompletedTickets,
        dto.configuration.showTimers,
        dto.configuration.audioAlertsEnabled
      ),
      refreshPolicy: new DisplayRefreshPolicy(dto.refreshIntervalSeconds),
      filters: new DisplayFilter(dto.filters.categories, dto.filters.priorities),
      status: new DisplayStatus('Inactive'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(display);
    return display;
  }

  public async updateDisplay(id: string, dto: UpdateKitchenDisplayDto): Promise<IKitchenDisplay> {
    const errors = validateUpdateKitchenDisplay(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const display = await this.getDisplay(id);

    if (dto.name && dto.name !== display.name) {
      const existing = await this.repository.findByNameAndStationId(dto.name, display.stationId);
      if (existing && existing.id !== display.id) {
        throw new ConflictException(`Display name '${dto.name}' is already used in this station`);
      }
      display.name = dto.name;
    }

    if (dto.layout) {
      display.layout = new DisplayLayout(dto.layout as any);
    }
    if (dto.refreshIntervalSeconds) {
      display.refreshPolicy = new DisplayRefreshPolicy(dto.refreshIntervalSeconds);
    }
    if (dto.configuration) {
      display.configuration = new DisplayConfiguration(
        dto.configuration.showCompletedTickets ?? display.configuration.showCompletedTickets,
        dto.configuration.showTimers ?? display.configuration.showTimers,
        dto.configuration.audioAlertsEnabled ?? display.configuration.audioAlertsEnabled
      );
    }
    if (dto.filters) {
      display.filters = new DisplayFilter(
        dto.filters.categories ?? display.filters.categories,
        dto.filters.priorities ?? display.filters.priorities
      );
    }

    display.updatedAt = new Date();
    await this.repository.save(display);

    return display;
  }

  public async activateDisplay(id: string): Promise<IKitchenDisplay> {
    const display = await this.getDisplay(id);
    if (display.status.isActive()) {
      return display;
    }

    display.status = new DisplayStatus('Active');
    display.updatedAt = new Date();
    await this.repository.save(display);
    new KitchenDisplayActivatedEvent(display.id);

    return display;
  }

  public async deactivateDisplay(id: string, status: 'Inactive' | 'Maintenance'): Promise<IKitchenDisplay> {
    const display = await this.getDisplay(id);
    display.status = new DisplayStatus(status);
    display.updatedAt = new Date();
    await this.repository.save(display);
    new KitchenDisplayDeactivatedEvent(display.id);

    return display;
  }

  public async receiveTicketUpdate(id: string): Promise<void> {
    const display = await this.getDisplay(id);
    if (!display.status.isActive()) {
      throw new ConflictException('Only Active displays may receive updates');
    }
  }

  private async getDisplay(id: string): Promise<IKitchenDisplay> {
    const display = await this.repository.findById(id);
    if (!display) throw new NotFoundException('Kitchen Display not found');
    return display;
  }
}
