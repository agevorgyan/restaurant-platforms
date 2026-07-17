import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IStockMovementRepository } from '../repositories/stock-movement.repository.interface';
import { CreateStockMovementDto, UpdateStockMovementDto, StockMovementLineDto } from '../../application/dto/stock-movement.dto';
import { validateCreateStockMovement, validateUpdateStockMovement } from '../../application/validation/stock-movement.schema';
import { IStockMovement } from '../entities/stock-movement.interface';
import { IStockMovementLine } from '../entities/stock-movement-line.interface';
import { MovementType } from '../value-objects/movement-type.value-object';
import { MovementReason } from '../value-objects/movement-reason.value-object';
import { MovementStatus } from '../value-objects/movement-status.value-object';
import { MovementQuantity } from '../value-objects/movement-quantity.value-object';
import { ReferenceType } from '../value-objects/reference-type.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';
import {
  StockMovementCreatedEvent,
  StockMovementPostedEvent,
  StockMovementCancelledEvent
} from '../events/stock-movement.events';

@Injectable()
export class StockMovementDomainService {
  constructor(private readonly repository: IStockMovementRepository) {}

  private mapLines(dtos: StockMovementLineDto[]): IStockMovementLine[] {
    return dtos.map(dto => ({
      ingredientId: dto.ingredientId,
      quantity: new MovementQuantity(dto.quantity),
      unitOfMeasure: dto.unitOfMeasure,
      lotNumber: dto.lotNumber,
      expirationDate: dto.expirationDate
    }));
  }

  public async createMovement(id: string, dto: CreateStockMovementDto): Promise<IStockMovement> {
    const errors = validateCreateStockMovement(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const existing = await this.repository.findByMovementNumber(dto.movementNumber, dto.restaurantId);
    if (existing) {
      throw new ConflictException(`Movement number '${dto.movementNumber}' already exists`);
    }

    const movement: IStockMovement = {
      id,
      restaurantId: dto.restaurantId,
      inventoryId: dto.inventoryId,
      movementNumber: dto.movementNumber,
      movementType: new MovementType(dto.movementType as any),
      reason: new MovementReason(dto.reason),
      status: new MovementStatus('Draft'),
      referenceType: dto.referenceType ? new ReferenceType(dto.referenceType as any) : undefined,
      referenceId: dto.referenceId ? new ReferenceId(dto.referenceId) : undefined,
      movementDate: dto.movementDate || new Date(),
      lines: this.mapLines(dto.lines),
      notes: dto.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(movement);
    new StockMovementCreatedEvent(movement.id, movement.restaurantId);
    return movement;
  }

  public async updateMovement(id: string, dto: UpdateStockMovementDto): Promise<IStockMovement> {
    const errors = validateUpdateStockMovement(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const movement = await this.getMovement(id);

    if (movement.status.isPosted()) {
      throw new ConflictException('Posted movements are immutable');
    }

    if (movement.status.isCancelled()) {
      throw new ConflictException('Cancelled movements cannot be edited');
    }

    if (dto.reason !== undefined) movement.reason = new MovementReason(dto.reason);
    if (dto.referenceType !== undefined) movement.referenceType = new ReferenceType(dto.referenceType as any);
    if (dto.referenceId !== undefined) movement.referenceId = new ReferenceId(dto.referenceId);
    if (dto.movementDate !== undefined) movement.movementDate = dto.movementDate;
    if (dto.lines !== undefined) movement.lines = this.mapLines(dto.lines);
    if (dto.notes !== undefined) movement.notes = dto.notes;

    movement.updatedAt = new Date();
    await this.repository.save(movement);

    return movement;
  }

  public async postMovement(id: string): Promise<IStockMovement> {
    const movement = await this.getMovement(id);

    if (movement.status.isCancelled()) {
      throw new ConflictException('Cancelled movements cannot be posted');
    }

    if (!movement.status.isPosted()) {
      movement.status = new MovementStatus('Posted');
      movement.updatedAt = new Date();
      await this.repository.save(movement);
      new StockMovementPostedEvent(movement.id, movement.restaurantId);
    }

    return movement;
  }

  public async cancelMovement(id: string): Promise<IStockMovement> {
    const movement = await this.getMovement(id);

    if (movement.status.isPosted()) {
      throw new ConflictException('Posted movements are immutable and cannot be cancelled');
    }

    if (!movement.status.isCancelled()) {
      movement.status = new MovementStatus('Cancelled');
      movement.updatedAt = new Date();
      await this.repository.save(movement);
      new StockMovementCancelledEvent(movement.id, movement.restaurantId);
    }

    return movement;
  }

  private async getMovement(id: string): Promise<IStockMovement> {
    const movement = await this.repository.findById(id);
    if (!movement) throw new NotFoundException('Stock movement not found');
    return movement;
  }
}
