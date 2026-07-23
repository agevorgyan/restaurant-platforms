export interface CustomerRepository {
  findById(id: string): Promise<any | null>;
  save(customer: any): Promise<void>;
  delete(id: string): Promise<void>;
}