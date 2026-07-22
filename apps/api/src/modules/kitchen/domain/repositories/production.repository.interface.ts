import { Production } from '../aggregates/production.aggregate';

export interface ProductionRepository {
  findById(id: string): Promise<Production | null>;
  findByNumber(productionNumber: string): Promise<Production | null>;
  save(production: Production): Promise<void>;
}
