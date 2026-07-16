export class CreateProductDto {
  restaurantId: string;
  menuId: string;
  categoryId: string;
  sku: string;
  barcode?: string;
  name: string;
  shortDescription?: string;
  description?: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  currency: string;
  imageUrl?: string;
  gallery?: string[];
  sortOrder?: number;
  isFeatured?: boolean;
  isRecommended?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  containsAlcohol?: boolean;
  preparationTime?: number;
  visibility?: string;
  status?: string;
  availability?: string;
}

export class UpdateProductDto {
  categoryId?: string;
  sku?: string;
  barcode?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  slug?: string;
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  currency?: string;
  imageUrl?: string;
  gallery?: string[];
  status?: string;
  availability?: string;
  sortOrder?: number;
  isFeatured?: boolean;
  isRecommended?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isSpicy?: boolean;
  containsAlcohol?: boolean;
  preparationTime?: number;
}
