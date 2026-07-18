import { ISupplierContractRepository } from '../repositories/supplier-contract.repository.interface';
import { ISupplierContract } from '../entities/supplier-contract.interface';
import { ContractStatus } from '../value-objects/contract-status.value-object';
import { ContractPeriod } from '../value-objects/contract-period.value-object';
import { LeadTime } from '../value-objects/lead-time.value-object';
import { MinimumOrderQuantity } from '../value-objects/minimum-order-quantity.value-object';
import { CreateSupplierContractDto } from '../../application/dto/supplier-contract.dto';
import {
  SupplierContractCreatedEvent,
  SupplierContractActivatedEvent,
  SupplierContractExpiredEvent
} from '../events/supplier-contract.events';

export class SupplierContractDomainService {
  constructor(private readonly supplierContractRepository: ISupplierContractRepository) {}

  async createContract(id: string, dto: CreateSupplierContractDto): Promise<ISupplierContract> {
    const existingContract = await this.supplierContractRepository.findByContractNumber(dto.restaurantId, dto.contractNumber);
    if (existingContract) {
      throw new Error(`Contract number ${dto.contractNumber} already exists`);
    }

    const contract: ISupplierContract = {
      id,
      restaurantId: dto.restaurantId,
      supplierId: dto.supplierId,
      contractNumber: dto.contractNumber,
      status: new ContractStatus('Draft'),
      effectivePeriod: new ContractPeriod(dto.effectiveStartDate, dto.effectiveEndDate),
      paymentTerms: dto.paymentTerms,
      currency: dto.currency,
      leadTime: new LeadTime(dto.leadTimeDays),
      minimumOrderQuantity: new MinimumOrderQuantity(dto.minimumOrderQuantity),
      lines: dto.lines.map(l => ({
        ingredientId: l.ingredientId,
        defaultPriceListId: l.defaultPriceListId,
        notes: l.notes
      })),
      domainEvents: [new SupplierContractCreatedEvent(id, dto.restaurantId)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.supplierContractRepository.save(contract);
    return contract;
  }

  async activateContract(id: string): Promise<ISupplierContract> {
    const contract = await this.supplierContractRepository.findById(id);
    if (!contract) throw new Error('Contract not found');

    if (contract.status.isArchived() || contract.status.isExpired()) {
      throw new Error('Cannot activate an expired or archived contract');
    }

    const activeContracts = await this.supplierContractRepository.findActiveContractsBySupplier(contract.supplierId);
    if (activeContracts.some(c => c.id !== contract.id)) {
      throw new Error('Only one active contract per supplier is allowed');
    }

    contract.status = new ContractStatus('Active');
    contract.domainEvents = contract.domainEvents || [];
    contract.domainEvents.push(new SupplierContractActivatedEvent(contract.id, contract.restaurantId));
    contract.updatedAt = new Date();
    await this.supplierContractRepository.save(contract);
    return contract;
  }

  async expireContract(id: string): Promise<ISupplierContract> {
    const contract = await this.supplierContractRepository.findById(id);
    if (!contract) throw new Error('Contract not found');

    if (contract.status.isArchived()) {
      throw new Error('Archived contracts are immutable');
    }

    contract.status = new ContractStatus('Expired');
    contract.domainEvents = contract.domainEvents || [];
    contract.domainEvents.push(new SupplierContractExpiredEvent(contract.id, contract.restaurantId));
    contract.updatedAt = new Date();
    await this.supplierContractRepository.save(contract);
    return contract;
  }

  async archiveContract(id: string): Promise<ISupplierContract> {
    const contract = await this.supplierContractRepository.findById(id);
    if (!contract) throw new Error('Contract not found');

    contract.status = new ContractStatus('Archived');
    contract.updatedAt = new Date();
    await this.supplierContractRepository.save(contract);
    return contract;
  }
}
