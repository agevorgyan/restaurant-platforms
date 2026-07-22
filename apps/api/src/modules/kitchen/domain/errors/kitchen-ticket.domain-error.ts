export class KitchenTicketDomainError extends Error {
  public readonly code = 'KITCHEN_TICKET.DOMAIN_ERROR';

  constructor(message: string, public readonly metadata?: unknown) {
    super(message);
    this.name = 'KitchenTicketDomainError';
  }
}
