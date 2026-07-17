import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { CreatePaymentDto, UpdatePaymentStatusDto } from '../../application/dto/payment.dto';
import { validateCreatePayment, validateUpdatePaymentStatus } from '../../application/validation/payment.schema';
import { PaymentAmount } from '../../domain/value-objects/payment-amount.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { PaymentType } from '../../domain/value-objects/payment-type.value-object';
import { PaymentReference } from '../../domain/value-objects/payment-reference.value-object';
import { IPayment } from '../../domain/entities/payment.interface';
import {
  PaymentCreatedEvent,
  PaymentAuthorizedEvent,
  PaymentCapturedEvent,
  PaymentFailedEvent,
  PaymentRefundedEvent,
  PaymentCancelledEvent
} from '../../domain/events/payment.events';

@Injectable()
export class PaymentDomainService {
  constructor(private readonly repository: IPaymentRepository) {}

  public async createPayment(id: string, dto: CreatePaymentDto): Promise<IPayment> {
    const errors = validateCreatePayment(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Business Rule: Payment reference must be unique within the restaurant
    const existing = await this.repository.findByReference(dto.restaurantId, dto.paymentReference);
    if (existing) {
      throw new ConflictException(`Payment reference ${dto.paymentReference} already exists for this restaurant`);
    }

    const payment: IPayment = {
      id,
      restaurantId: dto.restaurantId,
      orderId: dto.orderId,
      paymentReference: new PaymentReference(dto.paymentReference),
      paymentType: new PaymentType(dto.paymentType),
      status: new PaymentStatus('Pending'),
      amount: new PaymentAmount(dto.amount, dto.currency),
      description: dto.description,
      metadata: dto.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(payment);
    new PaymentCreatedEvent(payment.id, payment.orderId);
    return payment;
  }

  public async updateStatus(id: string, dto: UpdatePaymentStatusDto): Promise<IPayment> {
    const errors = validateUpdatePaymentStatus(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const payment = await this.repository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment ${id} not found`);
    }

    const newStatus = new PaymentStatus(dto.status);

    // Transition checks
    if (!payment.status.canTransitionTo(dto.status as any)) {
      throw new ConflictException(`Illegal payment state transition from ${payment.status.value} to ${dto.status}`);
    }

    payment.status = newStatus;
    payment.updatedAt = new Date();

    await this.repository.save(payment);

    if (dto.status === 'Authorized') {
      new PaymentAuthorizedEvent(payment.id, payment.orderId);
    } else if (dto.status === 'Captured') {
      new PaymentCapturedEvent(payment.id, payment.orderId);
    } else if (dto.status === 'Failed') {
      new PaymentFailedEvent(payment.id, payment.orderId);
    } else if (dto.status === 'Refunded') {
      new PaymentRefundedEvent(payment.id, payment.orderId);
    } else if (dto.status === 'Cancelled') {
      new PaymentCancelledEvent(payment.id, payment.orderId);
    }

    return payment;
  }
}
