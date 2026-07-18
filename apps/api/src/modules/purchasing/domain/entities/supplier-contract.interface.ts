import { ContractStatus } from '../value-objects/contract-status.value-object';
import { ContractPeriod } from '../value-objects/contract-period.value-object';
import { LeadTime } from '../value-objects/lead-time.value-object';
import { MinimumOrderQuantity } from '../value-objects/minimum-order-quantity.value-object';
import { IContractLine } from './contract-line.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface ISupplierContract {
  id: string;
  restaurantId: string;
  supplierId: string;
  contractNumber: string;
  status: ContractStatus;
  effectivePeriod: ContractPeriod;
  paymentTerms: string;
  currency: string;
  leadTime: LeadTime;
  minimumOrderQuantity: MinimumOrderQuantity;
  lines: IContractLine[];
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
