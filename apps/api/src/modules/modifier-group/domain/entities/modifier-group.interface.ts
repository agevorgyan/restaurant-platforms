import { ModifierGroupStatus } from '../value-objects/modifier-group-status.value-object';
import { ModifierSelectionRules } from '../value-objects/modifier-selection-rules.value-object';

export interface IModifierGroup {
  id: string;
  restaurantId: string;
  menuId: string;
  name: string;
  description?: string;
  displayName?: string;
  sortOrder: number;
  status: ModifierGroupStatus;
  selectionRules: ModifierSelectionRules; // Combines type, min, max, isRequired, allowMultipleSelections
  createdAt: Date;
  updatedAt: Date;
}
