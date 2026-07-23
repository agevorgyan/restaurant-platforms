export interface MenuCategoryRepository {
  findById(id: string): Promise<any | null>;
  save(category: any): Promise<void>;
  delete(id: string): Promise<void>;
}