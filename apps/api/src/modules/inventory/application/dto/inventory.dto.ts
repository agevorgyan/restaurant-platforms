export interface CreateInventoryDto {
  restaurantId: string;
  branchId?: string;
  name: string;
  code: string;
  type: string;
  location: string;
  capacity: number;
}

export interface UpdateInventoryDto {
  name?: string;
  capacity?: number;
}
