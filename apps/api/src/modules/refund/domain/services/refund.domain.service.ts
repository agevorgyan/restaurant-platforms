import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IRefundRepository, IRefundPolicy } from '../../domain/repositories/refund.repository.interface';
import { CreateRefundDto, ApproveRefundDto, CompleteRefundDto } from '../../application/dto/refund.dto';
import { validateCreateRefund, validateApproveRefund, validateCompleteRefund } from '../../application/validation/refund.schema';
import { RefundAmount } from '../../domain/value-objects/refund-amount.value-object';
import { RefundReason } from '../../domain/value-objects/refund-reason.value-object';
import { RefundStatus } from '../../domain/value-objects/refund-status.value-object';
import { IRefund } from '../../domain/entities/refund.interface';
import {
  RefundRequestedEvent,
  RefundApprovedEvent,
  RefundRejectedEvent,
  RefundCompletedEvent
} from '../../domain/events/refund.events';

@Injectable()
export class RefundDomainService {
  constructor(
    private readonly repository: IRefundRepository,
    private readonly policy: IRefundPolicy
  ) {}

  public async requestRefund(id: string, dto: CreateRefundDto): Promise<IRefund> {
    const errors = validateCreateRefund(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Refund reference must be unique within the restaurant
    const existingReference = await this.repository.findByReference(dto.restaurantId, dto.refundReference);
    if (existingReference) {
      throw new ConflictException(`Refund reference ${dto.refundReference} already exists`);
    }

    const { captured, currency } = await this.policy.getCapturedAmountForPayment(dto.paymentId);
    
    // Currency must match the original payment
    if (currency !== dto.currency) {
      throw new ConflictException(`Currency mismatch. Expected ${currency}, got ${dto.currency}`);
    }

    const existingRefunds = await this.repository.findByPaymentId(dto.paymentId);
    
    // Total refunded amount must never exceed the captured amount
    let totalRefunded = 0;
    for (const refund of existingRefunds) {
      // We count any refund that isn't Rejected or Cancelled against the captured amount to prevent over-refunding in-flight.
      if (!['Rejected', 'Cancelled'].includes(refund.status.value)) {
        totalRefunded += refund.amount.value;
      }
    }

    if (totalRefunded + dto.amount > captured) {
      throw new ConflictException('Total refunded amount cannot exceed the captured amount');
    }

    const refund: IRefund = {
      id,
      restaurantId: dto.restaurantId,
      paymentId: dto.paymentId,
      refundReference: dto.refundReference,
      amount: new RefundAmount(dto.amount, dto.currency),
      reason: new RefundReason(dto.reason, dto.reasonDetails),
      status: new RefundStatus('Requested'),
      requestedBy: dto.requestedBy,
      metadata: dto.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(refund);
    new RefundRequestedEvent(refund);
    return refund;
  }

  public async approveRefund(id: string, dto: ApproveRefundDto): Promise<IRefund> {
    const errors = validateApproveRefund(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const refund = await this.repository.findById(id);
    if (!refund) throw new NotFoundException('Refund not found');

    if (!refund.status.canTransitionTo('Approved')) {
      throw new ConflictException(`Cannot approve a refund currently in status: ${refund.status.value}`);
    }

    refund.status = new RefundStatus('Approved');
    refund.approvedBy = dto.approvedBy;
    refund.approvedAt = new Date();
    refund.updatedAt = new Date();

    await this.repository.save(refund);
    new RefundApprovedEvent(refund);

    return refund;
  }

  public async rejectRefund(id: string): Promise<IRefund> {
    const refund = await this.repository.findById(id);
    if (!refund) throw new NotFoundException('Refund not found');

    if (!refund.status.canTransitionTo('Rejected')) {
      throw new ConflictException(`Cannot reject a refund currently in status: ${refund.status.value}`);
    }

    refund.status = new RefundStatus('Rejected');
    refund.updatedAt = new Date();

    await this.repository.save(refund);
    new RefundRejectedEvent(refund);

    return refund;
  }

  public async markProcessing(id: string): Promise<IRefund> {
    const refund = await this.repository.findById(id);
    if (!refund) throw new NotFoundException('Refund not found');

    if (!refund.status.canTransitionTo('Processing')) {
      throw new ConflictException(`Only approved refunds may enter Processing. Current status: ${refund.status.value}`);
    }

    refund.status = new RefundStatus('Processing');
    refund.updatedAt = new Date();

    await this.repository.save(refund);
    return refund;
  }

  public async completeRefund(id: string, dto: CompleteRefundDto): Promise<IRefund> {
    const errors = validateCompleteRefund(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const refund = await this.repository.findById(id);
    if (!refund) throw new NotFoundException('Refund not found');

    if (!refund.status.canTransitionTo('Completed')) {
      throw new ConflictException(`Cannot complete a refund currently in status: ${refund.status.value}`);
    }

    refund.status = new RefundStatus('Completed');
    refund.transactionId = dto.transactionId;
    refund.completedAt = new Date();
    refund.updatedAt = new Date();

    await this.repository.save(refund);
    new RefundCompletedEvent(refund);

    return refund;
  }
}
