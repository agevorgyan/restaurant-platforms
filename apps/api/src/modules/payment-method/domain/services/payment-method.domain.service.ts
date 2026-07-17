import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IPaymentMethodRepository } from '../../domain/repositories/payment-method.repository.interface';
import { IPaymentMethodPolicy } from '../../domain/interfaces/payment-method-policy.interface';
import { CreatePaymentMethodDto, UpdatePaymentMethodStatusDto } from '../../application/dto/payment-method.dto';
import { validateCreatePaymentMethod, validateUpdatePaymentMethodStatus } from '../../application/validation/payment-method.schema';
import { PaymentMethodConfiguration } from '../../domain/value-objects/payment-method-configuration.value-object';
import { PaymentMethodAvailability } from '../../domain/value-objects/payment-method-availability.value-object';
import { IPaymentMethod } from '../../domain/entities/payment-method.interface';
import {
  PaymentMethodCreatedEvent,
  PaymentMethodChangedEvent,
  PaymentMethodActivatedEvent,
  PaymentMethodDeactivatedEvent
} from '../../domain/events/payment-method.events';

@Injectable()
export class PaymentMethodDomainService implements IPaymentMethodPolicy {
  constructor(private readonly repository: IPaymentMethodRepository) {}

  public canBeSelected(paymentMethod: IPaymentMethod): boolean {
    return paymentMethod.availability.canBeSelected();
  }

  public async isProviderValidForRestaurant(restaurantId: string, provider: string): Promise<boolean> {
    const existing = await this.repository.findByProvider(restaurantId, provider as any);
    return !existing; // true if it doesn't exist yet
  }

  public async createPaymentMethod(id: string, dto: CreatePaymentMethodDto): Promise<IPaymentMethod> {
    const errors = validateCreatePaymentMethod(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Business Rule: Provider name must be unique within a restaurant.
    const isProviderValid = await this.isProviderValidForRestaurant(dto.restaurantId, dto.provider);
    if (!isProviderValid) {
      throw new ConflictException(`Provider ${dto.provider} is already configured for this restaurant`);
    }

    // Business Rule: Only one default payment method per payment type.
    if (dto.isDefault) {
      const existingDefault = await this.repository.findDefaultByType(dto.restaurantId, dto.paymentType);
      if (existingDefault) {
        throw new ConflictException(`A default payment method already exists for type ${dto.paymentType}`);
      }
    }

    const paymentMethod: IPaymentMethod = {
      id,
      restaurantId: dto.restaurantId,
      name: dto.name,
      provider: dto.provider,
      paymentType: dto.paymentType,
      status: 'Inactive', // Created as inactive by default
      displayOrder: dto.displayOrder || 0,
      isDefault: dto.isDefault || false,
      supportedCurrencies: dto.supportedCurrencies,
      supportedOrderTypes: dto.supportedOrderTypes,
      configuration: new PaymentMethodConfiguration(dto.provider, dto.configurationSettings),
      availability: new PaymentMethodAvailability('Inactive'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(paymentMethod);
    new PaymentMethodCreatedEvent(paymentMethod.id, paymentMethod.restaurantId);
    return paymentMethod;
  }

  public async updateStatus(id: string, dto: UpdatePaymentMethodStatusDto): Promise<IPaymentMethod> {
    const errors = validateUpdatePaymentMethodStatus(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const paymentMethod = await this.repository.findById(id);
    if (!paymentMethod) {
      throw new NotFoundException(`Payment Method ${id} not found`);
    }

    const newAvailability = new PaymentMethodAvailability(dto.status);
    paymentMethod.availability = newAvailability;
    paymentMethod.status = dto.status;
    paymentMethod.updatedAt = new Date();

    await this.repository.save(paymentMethod);

    if (dto.status === 'Active') {
      new PaymentMethodActivatedEvent(paymentMethod.id, paymentMethod.restaurantId);
    } else if (dto.status === 'Inactive' || dto.status === 'Disabled') {
      new PaymentMethodDeactivatedEvent(paymentMethod.id, paymentMethod.restaurantId);
    } else {
      new PaymentMethodChangedEvent(paymentMethod.id, paymentMethod.restaurantId);
    }

    return paymentMethod;
  }
}
