import { CategoryStatus } from '../value-objects/category-status.value-object';
import { CategoryVisibility } from '../value-objects/category-visibility.value-object';

export interface ICategory {
  id: string;
  restaurantId: string;
  menuId: string;
  parentCategoryId?: string;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  icon?: string;
  sortOrder: number;
  status: CategoryStatus;
  visibility: CategoryVisibility;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}
