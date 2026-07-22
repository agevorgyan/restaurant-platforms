export interface KitchenTicketRepository {
  findById(id: string): Promise<any | null>;
}
