import { ISupplierPriceList } from '../entities/supplier-price-list.interface';

export interface ISupplierPriceListRepository {
  findById(id: string): Promise<ISupplierPriceList | null>;
  findPublishedBySupplier(supplierId: string): Promise<ISupplierPriceList[]>;
  save(priceList: ISupplierPriceList): Promise<void>;
}
