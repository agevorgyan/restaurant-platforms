export interface CustomizationChoice {
  id: string;
  name: string;
  priceAdjustment?: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  required: boolean;
  maxChoices: number;
  choices: CustomizationChoice[];
}

export type DietaryTag =
  | "vegan"
  | "vegetarian"
  | "gluten-free"
  | "dairy-free"
  | "nut-free"
  | "chef-special";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dietary: DietaryTag[];
  allergens: string[];
  customizations?: CustomizationOption[];
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji or SVG path identifier
  description: string;
}

export interface CartItem {
  id: string; // Unique key = itemId + serialized selected customizations
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations: Record<string, CustomizationChoice[]>;
  notes?: string;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  currency: {
    code: string;
    symbol: string;
  };
  fees: {
    taxRate: number; // e.g. 0.08 for 8%
    serviceChargeRate: number; // e.g. 0.10 for 10%
  };
}
