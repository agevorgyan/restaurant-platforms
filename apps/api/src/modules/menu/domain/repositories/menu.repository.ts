export interface MenuRepository {
  findById(id: string): Promise<any | null>;
  save(menu: any): Promise<void>;
  delete(id: string): Promise<void>;
}