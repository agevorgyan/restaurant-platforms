import { IKitchenTicket } from '../entities/kitchen-ticket.interface';

export interface IKitchenTicketRepository {
  findById(id: string): Promise<IKitchenTicket | null>;
  findByTicketNumberAndKitchenId(ticketNumber: string, kitchenId: string): Promise<IKitchenTicket | null>;
  save(ticket: IKitchenTicket): Promise<void>;
}
