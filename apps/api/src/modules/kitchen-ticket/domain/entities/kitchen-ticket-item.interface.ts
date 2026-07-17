export interface IKitchenTicketItem {
  id: string;
  orderItemId: string;
  productSnapshot: any; // Immutable order snapshot
  quantity: number;
  modifierSnapshot: any; // Immutable modifier snapshot
  specialInstructions?: string;
  status: string;
}
