export interface CreateKitchenWorkflowDto {
  ticketId: string;
  kitchenId: string;
  expectedDurationMinutes: number;
  slaThresholdMinutes: number;
}
