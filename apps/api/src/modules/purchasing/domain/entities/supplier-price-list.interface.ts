import { PriceListStatus } from '../value-objects/price-list-status.value-object';
import { PriceValidityPeriod } from '../value-objects/price-validity-period.value-object';
import { IPriceListItem } from './price-list-item.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface ISupplierPriceList {
  id: string;
  restaurantId: string;
  supplierId: string;
  name: string;
  status: PriceListStatus;
  currency: string;
  validityPeriod: PriceValidityPeriod;
  items: IPriceListItem[];
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
