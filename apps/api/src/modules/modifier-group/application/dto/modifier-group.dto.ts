export class CreateModifierGroupDto {
  restaurantId: string;
  menuId: string;
  name: string;
  description?: string;
  displayName?: string;
  sortOrder: number;
  status?: string;
  selectionType: string;
  minimumSelections: number;
  maximumSelections: number;
  isRequired: boolean;
  allowMultipleSelections: boolean;
}

export class UpdateModifierGroupDto {
  name?: string;
  description?: string;
  displayName?: string;
  sortOrder?: number;
  status?: string;
  selectionType?: string;
  minimumSelections?: number;
  maximumSelections?: number;
  isRequired?: boolean;
  allowMultipleSelections?: boolean;
}
