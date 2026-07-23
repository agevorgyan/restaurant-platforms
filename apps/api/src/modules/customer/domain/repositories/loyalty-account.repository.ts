export interface LoyaltyAccountRepository {
  findById(id: string): Promise<any | null>;
  findByCustomerId(customerId: string): Promise<any | null>;
  save(account: any): Promise<void>;
}