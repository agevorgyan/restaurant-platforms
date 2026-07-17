import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IPaymentPolicyRepository } from '../../domain/repositories/payment-policy.repository.interface';
import { CreatePaymentPolicyDto, UpdatePaymentPolicyStatusDto } from '../../application/dto/payment-policy.dto';
import { validateCreatePaymentPolicy, validateUpdatePaymentPolicyStatus } from '../../application/validation/payment-policy.schema';
import { PaymentLimits } from '../../domain/value-objects/payment-limits.value-object';
import { SplitPaymentPolicy } from '../../domain/value-objects/split-payment-policy.value-object';
import { PaymentTimeoutPolicy, PaymentRetryPolicy, CurrencyPolicy, PolicyStatus } from '../../domain/value-objects/payment-policy-shared.value-object';
import { IPaymentPolicy } from '../../domain/entities/payment-policy.interface';
import {
  PaymentPolicyCreatedEvent,
  PaymentPolicyUpdatedEvent,
  PaymentPolicyActivatedEvent,
  PaymentPolicyDeactivatedEvent
} from '../../domain/events/payment-policy.events';

@Injectable()
export class PaymentPolicyDomainService {
  constructor(private readonly repository: IPaymentPolicyRepository) {}

  public async createPolicy(id: string, dto: CreatePaymentPolicyDto): Promise<IPaymentPolicy> {
    const errors = validateCreatePaymentPolicy(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const policy: IPaymentPolicy = {
      id,
      restaurantId: dto.restaurantId,
      name: dto.name,
      status: new PolicyStatus('Draft'),
      allowedPaymentMethods: dto.allowedPaymentMethods,
      supportedCurrencies: new CurrencyPolicy(dto.supportedCurrencies),
      limits: new PaymentLimits(dto.limits.minAmount, dto.limits.maxAmount),
      splitPaymentPolicy: new SplitPaymentPolicy(dto.splitPaymentPolicy.allowSplit, dto.splitPaymentPolicy.maxSplits),
      timeoutPolicy: new PaymentTimeoutPolicy(dto.timeoutPolicy.durationSeconds),
      retryPolicy: new PaymentRetryPolicy(dto.retryPolicy.maxAttempts),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(policy);
    new PaymentPolicyCreatedEvent(policy);
    return policy;
  }

  public async updateStatus(id: string, dto: UpdatePaymentPolicyStatusDto): Promise<IPaymentPolicy> {
    const errors = validateUpdatePaymentPolicyStatus(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const policy = await this.repository.findById(id);
    if (!policy) throw new NotFoundException('Payment Policy not found');

    if (dto.status === 'Active') {
      // Business Rule: Only one active payment policy per restaurant.
      const existingActive = await this.repository.findActiveByRestaurantId(policy.restaurantId);
      if (existingActive && existingActive.id !== policy.id) {
        throw new ConflictException('Only one active payment policy is allowed per restaurant');
      }
    }

    policy.status = new PolicyStatus(dto.status);
    policy.updatedAt = new Date();

    await this.repository.save(policy);

    if (dto.status === 'Active') {
      new PaymentPolicyActivatedEvent(policy);
    } else if (dto.status === 'Inactive') {
      new PaymentPolicyDeactivatedEvent(policy);
    } else {
      new PaymentPolicyUpdatedEvent(policy);
    }

    return policy;
  }

  public canBeApplied(policy: IPaymentPolicy): boolean {
    return policy.status.canBeApplied();
  }
}
