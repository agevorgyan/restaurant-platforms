import { IModifierOption } from '../entities/modifier-option.interface';

export interface IModifierOptionRepository {
  create(modifierOption: IModifierOption): Promise<IModifierOption>;
  findById(id: string): Promise<IModifierOption | null>;
  findByModifierGroupId(modifierGroupId: string): Promise<IModifierOption[]>;
  findBySku(restaurantId: string, sku: string): Promise<IModifierOption | null>;
  findDefaultByModifierGroupId(modifierGroupId: string): Promise<IModifierOption | null>;
  // Used to check the selection type of the parent group
  isModifierGroupSingleSelection(modifierGroupId: string): Promise<boolean>;
  update(id: string, modifierOption: Partial<IModifierOption>): Promise<IModifierOption>;
}
