import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IStockCountRepository } from '../repositories/stock-count.repository.interface';
import { CreateStockCountDto, UpdateStockCountDto, StockCountLineDto } from '../../application/dto/stock-count.dto';
import { validateCreateStockCount, validateUpdateStockCount } from '../../application/validation/stock-count.schema';
import { IStockCount } from '../entities/stock-count.interface';
import { IStockCountLine } from '../entities/stock-count-line.interface';
import { CountMethod } from '../value-objects/count-method.value-object';
import { CountStatus } from '../value-objects/count-status.value-object';
import { CountVariance } from '../value-objects/count-variance.value-object';
import { RecountPolicy } from '../value-objects/recount-policy.value-object';
import {
  StockCountCreatedEvent,
  StockCountStartedEvent,
  StockCountCompletedEvent,
  StockCountApprovedEvent,
  StockCountCancelledEvent
} from '../events/stock-count.events';

@Injectable()
export class StockCountDomainService {
  constructor(private readonly repository: IStockCountRepository) {}

  private mapLines(dtos: StockCountLineDto[]): IStockCountLine[] {
    return dtos.map(dto => ({
      ingredientId: dto.ingredientId,
      expectedQuantity: dto.expectedQuantity,
      countedQuantity: dto.countedQuantity,
      variance: new CountVariance(dto.expectedQuantity, dto.countedQuantity, dto.variance),
      unitOfMeasure: dto.unitOfMeasure,
      lotNumber: dto.lotNumber,
      expirationDate: dto.expirationDate,
      comment: dto.comment
    }));
  }

  public async createCount(id: string, dto: CreateStockCountDto): Promise<IStockCount> {
    const errors = validateCreateStockCount(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const existing = await this.repository.findByCountNumber(dto.countNumber, dto.restaurantId);
    if (existing) {
      throw new ConflictException(`Count number '${dto.countNumber}' already exists`);
    }

    const count: IStockCount = {
      id,
      restaurantId: dto.restaurantId,
      inventoryId: dto.inventoryId,
      countNumber: dto.countNumber,
      method: new CountMethod(dto.method as any),
      status: new CountStatus('Draft'),
      countDate: dto.countDate || new Date(),
      lines: this.mapLines(dto.lines),
      notes: dto.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(count);
    new StockCountCreatedEvent(count.id, count.restaurantId);
    return count;
  }

  public async updateCount(id: string, dto: UpdateStockCountDto): Promise<IStockCount> {
    const errors = validateUpdateStockCount(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const count = await this.getCount(id);

    if (count.status.isApproved() || count.status.isCancelled()) {
      throw new ConflictException('Approved or Cancelled counts are immutable');
    }

    if (dto.countDate !== undefined) count.countDate = dto.countDate;
    if (dto.lines !== undefined) count.lines = this.mapLines(dto.lines);
    if (dto.notes !== undefined) count.notes = dto.notes;

    count.updatedAt = new Date();
    await this.repository.save(count);

    return count;
  }

  public async startCount(id: string): Promise<IStockCount> {
    const count = await this.getCount(id);

    if (!count.status.isDraft()) {
      throw new ConflictException('Only Draft counts can be started');
    }

    count.status = new CountStatus('InProgress');
    count.updatedAt = new Date();
    await this.repository.save(count);
    new StockCountStartedEvent(count.id, count.restaurantId);

    return count;
  }

  public async completeCount(id: string): Promise<IStockCount> {
    const count = await this.getCount(id);

    if (!count.status.isInProgress()) {
      throw new ConflictException('Only InProgress counts can be completed');
    }

    count.status = new CountStatus('Completed');
    count.updatedAt = new Date();
    await this.repository.save(count);
    new StockCountCompletedEvent(count.id, count.restaurantId);

    return count;
  }

  public async approveCount(id: string): Promise<IStockCount> {
    const count = await this.getCount(id);

    if (!count.status.isCompleted()) {
      throw new ConflictException('Only Completed counts may be approved');
    }

    count.status = new CountStatus('Approved');
    count.updatedAt = new Date();
    await this.repository.save(count);
    new StockCountApprovedEvent(count.id, count.restaurantId);

    return count;
  }

  public async cancelCount(id: string): Promise<IStockCount> {
    const count = await this.getCount(id);

    if (count.status.isApproved()) {
      throw new ConflictException('Approved counts are immutable and cannot be cancelled');
    }

    if (!count.status.isCancelled()) {
      count.status = new CountStatus('Cancelled');
      count.updatedAt = new Date();
      await this.repository.save(count);
      new StockCountCancelledEvent(count.id, count.restaurantId);
    }

    return count;
  }

  public async recount(id: string, newLinesDto: StockCountLineDto[]): Promise<IStockCount> {
    const count = await this.getCount(id);

    if (!RecountPolicy.canRecount(count.status.value)) {
      throw new ConflictException('Recount is allowed only before approval');
    }

    const errors = validateUpdateStockCount({ lines: newLinesDto });
    if (errors.length > 0) throw new BadRequestException(errors);

    count.lines = this.mapLines(newLinesDto);
    // Restarting the count via recount
    count.status = new CountStatus('InProgress');
    count.updatedAt = new Date();
    
    await this.repository.save(count);
    return count;
  }

  private async getCount(id: string): Promise<IStockCount> {
    const count = await this.repository.findById(id);
    if (!count) throw new NotFoundException('Stock count not found');
    return count;
  }
}
