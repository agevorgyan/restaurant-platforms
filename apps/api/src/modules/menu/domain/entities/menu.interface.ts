import { MenuStatus } from '../value-objects/menu-status.value-object';
import { MenuVisibility } from '../value-objects/menu-visibility.value-object';

export interface IMenu {
  id: string;
  restaurantId: string;
  branchIds: string[];
  name: string;
  description: string;
  slug: string;
  status: MenuStatus;
  visibility: MenuVisibility;
  defaultLanguage: string;
  supportedLanguages: string[];
  sortOrder: number;
  isDefault?: boolean; // Context flag to evaluate rules
  createdAt: Date;
  updatedAt: Date;
}
