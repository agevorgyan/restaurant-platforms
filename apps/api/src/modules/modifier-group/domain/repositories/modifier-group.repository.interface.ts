import { IModifierGroup } from '../entities/modifier-group.interface';

export interface IModifierGroupRepository {
  create(modifierGroup: IModifierGroup): Promise<IModifierGroup>;
  findById(id: string): Promise<IModifierGroup | null>;
  findByRestaurantId(restaurantId: string): Promise<IModifierGroup[]>;
  findByMenuId(menuId: string): Promise<IModifierGroup[]>;
  isAssignedToAnyProduct(id: string): Promise<boolean>;
  update(id: string, modifierGroup: Partial<IModifierGroup>): Promise<IModifierGroup>;
}
