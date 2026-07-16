import { IProduct } from '../entities/product.interface';

export interface IProductRepository {
  create(product: IProduct): Promise<IProduct>;
  findById(id: string): Promise<IProduct | null>;
  findByRestaurantId(restaurantId: string): Promise<IProduct[]>;
  findByCategoryId(categoryId: string): Promise<IProduct[]>;
  findBySku(restaurantId: string, sku: string): Promise<IProduct | null>;
  findBySlug(menuId: string, slug: string): Promise<IProduct | null>;
  update(id: string, product: Partial<IProduct>): Promise<IProduct>;
}
