import { ProductStatus } from '../value-objects/product-status.value-object';
import { ProductAvailability } from '../value-objects/product-availability.value-object';
import { ProductPrice } from '../value-objects/product-price.value-object';

export interface IProduct {
  id: string;
  restaurantId: string;
  menuId: string;
  categoryId: string;
  sku: string;
  barcode?: string;
  name: string;
  shortDescription?: string;
  description?: string;
  slug: string;
  priceDetails: ProductPrice; // Combines price, compareAtPrice, costPrice, currency
  imageUrl?: string;
  gallery?: string[];
  status: ProductStatus;
  availability: ProductAvailability;
  sortOrder: number;
  isFeatured: boolean;
  isRecommended: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  containsAlcohol: boolean;
  preparationTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}
