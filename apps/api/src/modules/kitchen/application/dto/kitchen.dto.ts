export interface CreateKitchenDto {
  restaurantId: string;
  branchId: string;
  name: string;
  priorityMode: string;
  timezone: string;
  isDefault?: boolean;
}

export interface UpdateKitchenStatusDto {
  status: string;
}
