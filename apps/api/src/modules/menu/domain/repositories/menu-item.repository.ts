export interface MenuItemRepository {
  findById(id: string): Promise<any | null>;
  save(menuItem: any): Promise<void>;
  delete(id: string): Promise<void>;
}