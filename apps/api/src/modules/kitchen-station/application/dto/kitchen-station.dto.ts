export interface CreateKitchenStationDto {
  restaurantId: string;
  branchId: string;
  kitchenId: string;
  name: string;
  stationType: string;
  capacity: number;
  displayOrder?: number;
}

export interface UpdateKitchenStationStatusDto {
  status: string;
}
