import { ISupplierContract } from '../entities/supplier-contract.interface';

export interface ISupplierContractRepository {
  findById(id: string): Promise<ISupplierContract | null>;
  findByContractNumber(restaurantId: string, contractNumber: string): Promise<ISupplierContract | null>;
  findActiveContractsBySupplier(supplierId: string): Promise<ISupplierContract[]>;
  save(contract: ISupplierContract): Promise<void>;
}
