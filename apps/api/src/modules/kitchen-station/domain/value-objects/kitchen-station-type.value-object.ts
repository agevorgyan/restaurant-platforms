export type KitchenStationTypeEnum = 'Grill' | 'Fryer' | 'Pizza' | 'Salad' | 'Dessert' | 'Drinks' | 'Bar' | 'Expo' | 'Custom';

export class KitchenStationType {
  constructor(public readonly value: KitchenStationTypeEnum) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid station type: ${value}`);
    }
  }

  private isValid(value: string): value is KitchenStationTypeEnum {
    return ['Grill', 'Fryer', 'Pizza', 'Salad', 'Dessert', 'Drinks', 'Bar', 'Expo', 'Custom'].includes(value);
  }
}
