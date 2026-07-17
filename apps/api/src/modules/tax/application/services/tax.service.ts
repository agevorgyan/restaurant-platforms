import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ITaxRepository } from '../../domain/repositories/tax.repository.interface';
import { ITaxPolicy } from '../../domain/entities/tax-policy.interface';
import { TaxRule } from '../../domain/value-objects/tax-rule.value-object';
import { ServiceCharge } from '../../domain/value-objects/service-charge.value-object';
import { DeliveryFee } from '../../domain/value-objects/delivery-fee.value-object';
import { TipPolicy } from '../../domain/value-objects/tip-policy.value-object';
import { TaxCalculationPolicy } from '../../domain/value-objects/tax-calculation-policy.value-object';
import { TaxStatus } from '../../domain/value-objects/tax-status.value-object';
import { CreateTaxPolicyDto } from '../dto/tax.dto';
import { validateCreateTaxPolicy } from '../validation/tax.schema';
import { TaxPolicyCreatedEvent } from '../../domain/events/tax.events';

@Injectable()
export class TaxService {
  constructor(
    @Inject('ITaxRepository') private readonly repository: ITaxRepository,
  ) {}

  async create(dto: CreateTaxPolicyDto): Promise<ITaxPolicy> {
    const errors = validateCreateTaxPolicy(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Business Rule: Only one default tax policy per restaurant.
    if (dto.isDefault) {
      const existingDefault = await this.repository.findDefaultByRestaurantId(dto.restaurantId);
      if (existingDefault) {
        throw new BadRequestException('A default tax policy already exists for this restaurant');
      }
    }

    const rules = dto.taxRules.map(r => new TaxRule(r.name, r.type, r.percentage));
    const charges = (dto.serviceCharges || []).map(c => new ServiceCharge(c.name, c.type, c.value));
    
    const deliveryFee = new DeliveryFee(dto.deliveryFee || 0);
    const tipPolicy = new TipPolicy(dto.tipPolicyEnabled || false, dto.suggestedTipPercentages || []);
    const calcPolicy = new TaxCalculationPolicy(dto.calculationMode);
    const status = new TaxStatus('Active');

    const policy: ITaxPolicy = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      name: dto.name,
      description: dto.description,
      status,
      calculationMode: calcPolicy,
      taxRules: rules,
      serviceCharges: charges,
      deliveryFee,
      tipPolicy,
      priority: dto.priority || 0,
      isDefault: dto.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(policy);
    new TaxPolicyCreatedEvent(created);
    return created;
  }

  async validateApplication(policyId: string): Promise<ITaxPolicy> {
    const policy = await this.repository.findById(policyId);
    if (!policy) {
      throw new NotFoundException(`TaxPolicy with ID ${policyId} not found`);
    }

    // Business Rule: Inactive tax policies cannot be applied.
    if (!policy.status.canBeApplied()) {
      throw new BadRequestException('Inactive tax policies cannot be applied');
    }

    return policy;
  }
}
