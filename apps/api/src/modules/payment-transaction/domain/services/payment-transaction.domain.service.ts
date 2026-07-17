import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IPaymentTransactionRepository } from '../../domain/repositories/payment-transaction.repository.interface';
import { CreatePaymentTransactionDto, FailPaymentTransactionDto } from '../../application/dto/payment-transaction.dto';
import { validateCreatePaymentTransaction, validateFailPaymentTransaction } from '../../application/validation/payment-transaction.schema';
import { TransactionAmount } from '../../domain/value-objects/transaction-amount.value-object';
import {
  TransactionReference,
  IdempotencyKey,
  TransactionType,
  TransactionStatus,
  FailureReason
} from '../../domain/value-objects/transaction-strings.value-object';
import { IPaymentTransaction } from '../../domain/entities/payment-transaction.interface';
import {
  PaymentTransactionCreatedEvent,
  PaymentTransactionAuthorizedEvent,
  PaymentTransactionCapturedEvent,
  PaymentTransactionVoidedEvent,
  PaymentTransactionFailedEvent
} from '../../domain/events/payment-transaction.events';

@Injectable()
export class PaymentTransactionDomainService {
  constructor(private readonly repository: IPaymentTransactionRepository) {}

  public async createTransaction(id: string, dto: CreatePaymentTransactionDto): Promise<IPaymentTransaction> {
    const errors = validateCreatePaymentTransaction(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Duplicate idempotency keys must be rejected
    const existingIdempotency = await this.repository.findByIdempotencyKey(dto.idempotencyKey);
    if (existingIdempotency) {
      throw new ConflictException(`Idempotency key ${dto.idempotencyKey} has already been used`);
    }

    // Transaction reference must be unique
    const existingReference = await this.repository.findByReference(dto.transactionReference);
    if (existingReference) {
      throw new ConflictException(`Transaction reference ${dto.transactionReference} already exists`);
    }

    // Fetch existing transactions for this payment to validate bounds
    const existingTransactions = await this.repository.findByPaymentId(dto.paymentId);
    
    // Currency matching check
    if (existingTransactions.length > 0) {
      const parentCurrency = existingTransactions[0].amount.currency;
      if (parentCurrency !== dto.currency) {
        throw new ConflictException(`Currency mismatch. Expected ${parentCurrency}, got ${dto.currency}`);
      }
    }

    let authTotal = 0;
    let captureTotal = 0;
    let refundTotal = 0;

    for (const t of existingTransactions) {
      if (t.status.value === 'Succeeded') {
        if (t.transactionType.value === 'Authorization') authTotal += t.amount.value;
        if (t.transactionType.value === 'Capture' || t.transactionType.value === 'PartialCapture') captureTotal += t.amount.value;
        if (t.transactionType.value === 'Refund' || t.transactionType.value === 'PartialRefund') refundTotal += t.amount.value;
      }
    }

    // Capture amount cannot exceed the authorized amount
    if (dto.transactionType === 'Capture' || dto.transactionType === 'PartialCapture') {
      if (captureTotal + dto.amount > authTotal) {
        throw new ConflictException('Capture amount cannot exceed the authorized amount');
      }
    }

    // Refund amount cannot exceed the captured amount
    if (dto.transactionType === 'Refund' || dto.transactionType === 'PartialRefund') {
      if (refundTotal + dto.amount > captureTotal) {
        throw new ConflictException('Refund amount cannot exceed the captured amount');
      }
    }

    // Void is only allowed before capture
    if (dto.transactionType === 'Void') {
      if (captureTotal > 0) {
        throw new ConflictException('Void is only allowed before capture');
      }
    }

    // Settlement is only allowed after a successful capture
    if (dto.transactionType === 'Settlement') {
      if (captureTotal <= 0) {
        throw new ConflictException('Settlement is only allowed after a successful capture');
      }
    }

    const transaction: IPaymentTransaction = {
      id,
      paymentId: dto.paymentId,
      transactionReference: new TransactionReference(dto.transactionReference),
      gatewayReference: dto.gatewayReference,
      idempotencyKey: new IdempotencyKey(dto.idempotencyKey),
      transactionType: new TransactionType(dto.transactionType),
      status: new TransactionStatus('Pending'),
      amount: new TransactionAmount(dto.amount, dto.currency),
      metadata: dto.metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(transaction);
    new PaymentTransactionCreatedEvent(transaction);
    return transaction;
  }

  public async markSucceeded(id: string): Promise<IPaymentTransaction> {
    const transaction = await this.repository.findById(id);
    if (!transaction) throw new NotFoundException('Transaction not found');
    
    if (transaction.status.value !== 'Pending') {
      throw new ConflictException('Only pending transactions can be marked as succeeded');
    }

    transaction.status = new TransactionStatus('Succeeded');
    transaction.processedAt = new Date();
    transaction.updatedAt = new Date();

    await this.repository.save(transaction);

    // Emit specific events based on type
    if (transaction.transactionType.value === 'Authorization') {
      new PaymentTransactionAuthorizedEvent(transaction);
    } else if (transaction.transactionType.value === 'Capture' || transaction.transactionType.value === 'PartialCapture') {
      new PaymentTransactionCapturedEvent(transaction);
    } else if (transaction.transactionType.value === 'Void') {
      new PaymentTransactionVoidedEvent(transaction);
    }

    return transaction;
  }

  public async markFailed(id: string, dto: FailPaymentTransactionDto): Promise<IPaymentTransaction> {
    const errors = validateFailPaymentTransaction(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const transaction = await this.repository.findById(id);
    if (!transaction) throw new NotFoundException('Transaction not found');
    
    if (transaction.status.value !== 'Pending') {
      throw new ConflictException('Only pending transactions can be marked as failed');
    }

    transaction.status = new TransactionStatus('Failed');
    transaction.failureReason = new FailureReason(dto.failureCode, dto.failureMessage);
    transaction.processedAt = new Date();
    transaction.updatedAt = new Date();

    await this.repository.save(transaction);
    new PaymentTransactionFailedEvent(transaction);

    return transaction;
  }
}
