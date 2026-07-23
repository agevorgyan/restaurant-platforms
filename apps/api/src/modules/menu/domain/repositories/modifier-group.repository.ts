export interface ModifierGroupRepository {
  findById(id: string): Promise<any | null>;
  save(modifierGroup: any): Promise<void>;
  delete(id: string): Promise<void>;
}