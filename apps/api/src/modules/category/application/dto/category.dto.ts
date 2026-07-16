export class CreateCategoryDto {
  restaurantId: string;
  menuId: string;
  parentCategoryId?: string;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  icon?: string;
  sortOrder: number;
  visibility: string;
  seoTitle?: string;
  seoDescription?: string;
}

export class UpdateCategoryDto {
  parentCategoryId?: string;
  name?: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  icon?: string;
  sortOrder?: number;
  status?: string;
  visibility?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export class CategoryDto {
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
  status: string;
  visibility: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}
