import { ICategory } from '../entities/category.interface';

export interface ICategoryRepository {
  create(category: ICategory): Promise<ICategory>;
  findById(id: string): Promise<ICategory | null>;
  findByMenuId(menuId: string): Promise<ICategory[]>;
  findBySlug(menuId: string, slug: string): Promise<ICategory | null>;
  findByParentId(menuId: string, parentId?: string): Promise<ICategory[]>;
  getAncestors(id: string): Promise<ICategory[]>; // Used for nesting depth calculation
  hasActiveProducts(categoryId: string): Promise<boolean>; // Used for archiving validation
  update(id: string, category: Partial<ICategory>): Promise<ICategory>;
  delete(id: string): Promise<void>;
}
