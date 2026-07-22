export interface ProductionRepository {
  findById(id: string): Promise<any | null>;
}
