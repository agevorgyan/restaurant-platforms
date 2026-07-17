import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IInventoryAdjustmentRepository } from '../repositories/inventory-adjustment.repository.interface';
import { CreateInventoryAdjustmentDto, UpdateInventoryAdjustmentDto, InventoryAdjustmentLineDto } from '../../application/dto/inventory-adjustment.dto';
import { validateCreateInventoryAdjustment, validateUpdateInventoryAdjustment } from '../../application/validation/inventory-adjustment.schema';
import { IInventoryAdjustment } from '../entities/inventory-adjustment.interface';
import { IInventoryAdjustmentLine } from '../entities/inventory-adjustment-line.interface';
import { AdjustmentType } from '../value-objects/adjustment-type.value-object';
import { AdjustmentReason } from '../value-objects/adjustment-reason.value-object';
import { AdjustmentStatus } from '../value-objects/adjustment-status.value-object';
import { ApprovalStatus } from '../value-objects/approval-status.value-object';
import { AdjustmentQuantity } from '../value-objects/adjustment-quantity.value-object';
import { ReferenceType } from '../value-objects/reference-type.value-object';
import { ReferenceId } from '../value-objects/reference-id.value-object';
import {
  InventoryAdjustmentCreatedEvent,
  InventoryAdjustmentApprovedEvent,
  InventoryAdjustmentRejectedEvent,
  InventoryAdjustmentPostedEvent,
  InventoryAdjustmentCancelledEvent
} from '../events/inventory-adjustment.events';

@Injectable()
export class InventoryAdjustmentDomainService {
  constructor(private readonly repository: IInventoryAdjustmentRepository) {}

  private mapLines(dtos: InventoryAdjustmentLineDto[]): IInventoryAdjustmentLine[] {
    return dtos.map(dto => ({
      ingredientId: dto.ingredientId,
      quantity: new AdjustmentQuantity(dto.expectedQuantity, dto.actualQuantity, dto.differenceQuantity),
      unitOfMeasure: dto.unitOfMeasure,
      comment: dto.comment
    }));
  }

  public async createAdjustment(id: string, dto: CreateInventoryAdjustmentDto): Promise<IInventoryAdjustment> {
    const errors = validateCreateInventoryAdjustment(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const existing = await this.repository.findByAdjustmentNumber(dto.adjustmentNumber, dto.restaurantId);
    if (existing) {
      throw new ConflictException(`Adjustment number '${dto.adjustmentNumber}' already exists`);
    }

    const adjustment: IInventoryAdjustment = {
      id,
      restaurantId: dto.restaurantId,
      inventoryId: dto.inventoryId,
      adjustmentNumber: dto.adjustmentNumber,
      adjustmentType: new AdjustmentType(dto.adjustmentType as any),
      reason: new AdjustmentReason(dto.reason),
      status: new AdjustmentStatus('Draft'),
      approvalStatus: new ApprovalStatus(dto.approvalStatus as any),
      adjustmentDate: dto.adjustmentDate || new Date(),
      referenceType: dto.referenceType ? new ReferenceType(dto.referenceType as any) : undefined,
      referenceId: dto.referenceId ? new ReferenceId(dto.referenceId) : undefined,
      lines: this.mapLines(dto.lines),
      notes: dto.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(adjustment);
    new InventoryAdjustmentCreatedEvent(adjustment.id, adjustment.restaurantId);
    return adjustment;
  }

  public async updateAdjustment(id: string, dto: UpdateInventoryAdjustmentDto): Promise<IInventoryAdjustment> {
    const errors = validateUpdateInventoryAdjustment(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const adjustment = await this.getAdjustment(id);

    if (adjustment.status.isPosted()) {
      throw new ConflictException('Posted adjustments are immutable');
    }

    if (adjustment.status.isCancelled() || adjustment.status.isRejected()) {
      throw new ConflictException('Cancelled or Rejected adjustments cannot be edited');
    }

    if (dto.reason !== undefined) adjustment.reason = new AdjustmentReason(dto.reason);
    if (dto.referenceType !== undefined) adjustment.referenceType = new ReferenceType(dto.referenceType as any);
    if (dto.referenceId !== undefined) adjustment.referenceId = new ReferenceId(dto.referenceId);
    if (dto.adjustmentDate !== undefined) adjustment.adjustmentDate = dto.adjustmentDate;
    if (dto.lines !== undefined) adjustment.lines = this.mapLines(dto.lines);
    if (dto.notes !== undefined) adjustment.notes = dto.notes;

    adjustment.updatedAt = new Date();
    await this.repository.save(adjustment);

    return adjustment;
  }

  public async approveAdjustment(id: string): Promise<IInventoryAdjustment> {
    const adjustment = await this.getAdjustment(id);

    if (adjustment.status.isCancelled() || adjustment.status.isPosted()) {
      throw new ConflictException('Cannot approve a cancelled or posted adjustment');
    }

    if (adjustment.approvalStatus.isApprovedOrNotRequired()) {
      throw new ConflictException('Adjustment is already approved or does not require approval');
    }

    adjustment.approvalStatus = new ApprovalStatus('Approved');
    adjustment.status = new AdjustmentStatus('Approved');
    adjustment.updatedAt = new Date();
    await this.repository.save(adjustment);
    new InventoryAdjustmentApprovedEvent(adjustment.id, adjustment.restaurantId);

    return adjustment;
  }

  public async rejectAdjustment(id: string): Promise<IInventoryAdjustment> {
    const adjustment = await this.getAdjustment(id);

    if (adjustment.status.isCancelled() || adjustment.status.isPosted()) {
      throw new ConflictException('Cannot reject a cancelled or posted adjustment');
    }

    if (!adjustment.approvalStatus.isRejected()) {
      adjustment.approvalStatus = new ApprovalStatus('Rejected');
      adjustment.status = new AdjustmentStatus('Rejected');
      adjustment.updatedAt = new Date();
      await this.repository.save(adjustment);
      new InventoryAdjustmentRejectedEvent(adjustment.id, adjustment.restaurantId);
    }

    return adjustment;
  }

  public async postAdjustment(id: string): Promise<IInventoryAdjustment> {
    const adjustment = await this.getAdjustment(id);

    if (adjustment.status.isCancelled() || adjustment.status.isRejected()) {
      throw new ConflictException('Cancelled or rejected adjustments cannot be posted');
    }

    if (!adjustment.approvalStatus.isApprovedOrNotRequired()) {
      throw new ConflictException('Only Approved or NotRequired adjustments may be posted');
    }

    if (!adjustment.status.isPosted()) {
      adjustment.status = new AdjustmentStatus('Posted');
      adjustment.updatedAt = new Date();
      await this.repository.save(adjustment);
      new InventoryAdjustmentPostedEvent(adjustment.id, adjustment.restaurantId);
    }

    return adjustment;
  }

  public async cancelAdjustment(id: string): Promise<IInventoryAdjustment> {
    const adjustment = await this.getAdjustment(id);

    if (adjustment.status.isPosted()) {
      throw new ConflictException('Posted adjustments are immutable and cannot be cancelled');
    }

    if (!adjustment.status.isCancelled()) {
      adjustment.status = new AdjustmentStatus('Cancelled');
      adjustment.updatedAt = new Date();
      await this.repository.save(adjustment);
      new InventoryAdjustmentCancelledEvent(adjustment.id, adjustment.restaurantId);
    }

    return adjustment;
  }

  private async getAdjustment(id: string): Promise<IInventoryAdjustment> {
    const adjustment = await this.repository.findById(id);
    if (!adjustment) throw new NotFoundException('Inventory adjustment not found');
    return adjustment;
  }
}
