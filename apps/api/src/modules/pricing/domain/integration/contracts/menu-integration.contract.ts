export interface MenuIntegrationContract {
  // Provided to Menu Bounded Context
  menuItemId: string;
  basePrice: number;
  currencyCode: string;
  taxCategoryCode?: string;
}
