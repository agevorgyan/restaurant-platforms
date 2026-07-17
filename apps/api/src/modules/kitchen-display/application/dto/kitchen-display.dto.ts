export interface CreateKitchenDisplayDto {
  restaurantId: string;
  branchId: string;
  kitchenId: string;
  stationId: string;
  name: string;
  layout: string;
  refreshIntervalSeconds: number;
  configuration: {
    showCompletedTickets: boolean;
    showTimers: boolean;
    audioAlertsEnabled: boolean;
  };
  filters: {
    categories?: string[];
    priorities?: string[];
  };
}

export interface UpdateKitchenDisplayDto {
  name?: string;
  layout?: string;
  refreshIntervalSeconds?: number;
  configuration?: {
    showCompletedTickets: boolean;
    showTimers: boolean;
    audioAlertsEnabled: boolean;
  };
  filters?: {
    categories?: string[];
    priorities?: string[];
  };
}
