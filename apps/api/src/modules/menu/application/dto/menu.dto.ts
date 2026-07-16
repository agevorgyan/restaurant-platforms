export class CreateMenuDto {
  restaurantId: string;
  branchIds: string[];
  name: string;
  description: string;
  slug: string;
  visibility: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  sortOrder: number;
  isDefault?: boolean;
}

export class UpdateMenuDto {
  branchIds?: string[];
  name?: string;
  description?: string;
  slug?: string;
  status?: string;
  visibility?: string;
  supportedLanguages?: string[];
  sortOrder?: number;
  isDefault?: boolean;
}

export class MenuDto {
  id: string;
  restaurantId: string;
  branchIds: string[];
  name: string;
  description: string;
  slug: string;
  status: string;
  visibility: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  sortOrder: number;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
