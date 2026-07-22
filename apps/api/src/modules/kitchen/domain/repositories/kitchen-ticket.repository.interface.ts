import { KitchenTicket } from '../aggregates/kitchen-ticket.aggregate';

export interface KitchenTicketRepository {
  findById(id: string): Promise<KitchenTicket | null>;
  findByOrder(orderId: string): Promise<KitchenTicket[]>;
  save(ticket: KitchenTicket): Promise<void>;
}
