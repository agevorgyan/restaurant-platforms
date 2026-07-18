import { PriceListStatus } from '../value-objects/price-list-status.value-object';
import { PriceValidityPeriod } from '../value-objects/price-validity-period.value-object';
import { IPriceListItem } from './price-list-item.interface';

export interface ISupplierPriceList {
  id: string;
  restaurantId: string;
  supplierId: string;
  name: string;
  status: PriceListStatus;
  currency: string;
  validityPeriod: PriceValidityPeriod;
  items: IPriceListItem[];
  createdAt: Date;
  updatedAt: Date;
}
