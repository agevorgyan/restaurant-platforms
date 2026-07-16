import { IMenu } from '../entities/menu.interface';

export interface IMenuRepository {
  create(menu: IMenu): Promise<IMenu>;
  findById(id: string): Promise<IMenu | null>;
  findByRestaurantId(restaurantId: string): Promise<IMenu[]>;
  findBySlug(restaurantId: string, slug: string): Promise<IMenu | null>;
  findDefaultMenusByBranchIds(branchIds: string[]): Promise<IMenu[]>;
  update(id: string, menu: Partial<IMenu>): Promise<IMenu>;
}
