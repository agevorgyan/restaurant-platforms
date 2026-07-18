import { ICustomer } from '../entities/customer.interface';

export interface ICustomerRepository {
  findById(id: string): Promise<ICustomer | null>;
  findByCustomerCode(restaurantId: string, customerCode: string): Promise<ICustomer | null>;
  save(customer: ICustomer): Promise<void>;
}
