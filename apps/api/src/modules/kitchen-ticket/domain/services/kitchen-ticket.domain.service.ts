import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IKitchenTicketRepository } from '../repositories/kitchen-ticket.repository.interface';
import { CreateKitchenTicketDto } from '../../application/dto/kitchen-ticket.dto';
import { validateCreateKitchenTicket } from '../../application/validation/kitchen-ticket.schema';
import { IKitchenTicket } from '../entities/kitchen-ticket.interface';
import { KitchenTicketPriority } from '../value-objects/kitchen-ticket-priority.value-object';
import { KitchenTicketStatus } from '../value-objects/kitchen-ticket-status.value-object';
import { PreparationTime } from '../value-objects/preparation-time.value-object';
import { IKitchenTicketItem } from '../entities/kitchen-ticket-item.interface';
import {
  KitchenTicketCreatedEvent,
  KitchenTicketStartedEvent,
  KitchenTicketReadyEvent,
  KitchenTicketCompletedEvent,
  KitchenTicketCancelledEvent
} from '../events/kitchen-ticket.events';

@Injectable()
export class KitchenTicketDomainService {
  constructor(private readonly repository: IKitchenTicketRepository) {}

  public async createTicket(id: string, dto: CreateKitchenTicketDto): Promise<IKitchenTicket> {
    const errors = validateCreateKitchenTicket(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existing = await this.repository.findByTicketNumberAndKitchenId(dto.ticketNumber, dto.kitchenId);
    if (existing) {
      throw new ConflictException(`Ticket number '${dto.ticketNumber}' already exists in this kitchen`);
    }

    const items: IKitchenTicketItem[] = dto.items.map(item => ({
      id: item.id,
      orderItemId: item.orderItemId,
      productSnapshot: item.productSnapshot,
      quantity: item.quantity,
      modifierSnapshot: item.modifierSnapshot || null,
      specialInstructions: item.specialInstructions,
      status: 'Pending'
    }));

    const ticket: IKitchenTicket = {
      id,
      restaurantId: dto.restaurantId,
      branchId: dto.branchId,
      kitchenId: dto.kitchenId,
      stationId: dto.stationId,
      orderId: dto.orderId,
      ticketNumber: dto.ticketNumber,
      priority: new KitchenTicketPriority(dto.priority as any),
      status: new KitchenTicketStatus('Pending'),
      estimatedPreparationTime: new PreparationTime(dto.estimatedPreparationTime),
      requestedAt: new Date(),
      notes: dto.notes,
      items,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(ticket);
    new KitchenTicketCreatedEvent(ticket.id, ticket.kitchenId);
    return ticket;
  }

  public async startTicket(id: string): Promise<IKitchenTicket> {
    const ticket = await this.repository.findById(id);
    if (!ticket) throw new NotFoundException('Kitchen Ticket not found');

    if (ticket.status.isImmutable()) {
      throw new ConflictException('Cannot start an immutable ticket');
    }

    ticket.status = new KitchenTicketStatus('Preparing');
    ticket.startedAt = new Date();
    ticket.updatedAt = new Date();

    await this.repository.save(ticket);
    new KitchenTicketStartedEvent(ticket.id, ticket.kitchenId);
    return ticket;
  }

  public async readyTicket(id: string): Promise<IKitchenTicket> {
    const ticket = await this.repository.findById(id);
    if (!ticket) throw new NotFoundException('Kitchen Ticket not found');

    if (ticket.status.isImmutable()) {
      throw new ConflictException('Cannot ready an immutable ticket');
    }
    if (ticket.status.value === 'Cancelled') {
      throw new ConflictException('Cancelled tickets cannot become Ready');
    }

    ticket.status = new KitchenTicketStatus('Ready');
    ticket.readyAt = new Date();
    ticket.updatedAt = new Date();

    await this.repository.save(ticket);
    new KitchenTicketReadyEvent(ticket.id, ticket.kitchenId);
    return ticket;
  }

  public async completeTicket(id: string): Promise<IKitchenTicket> {
    const ticket = await this.repository.findById(id);
    if (!ticket) throw new NotFoundException('Kitchen Ticket not found');

    if (ticket.status.isImmutable()) {
      throw new ConflictException('Ticket is already immutable');
    }

    ticket.status = new KitchenTicketStatus('Completed');
    ticket.completedAt = new Date();
    ticket.updatedAt = new Date();

    await this.repository.save(ticket);
    new KitchenTicketCompletedEvent(ticket.id, ticket.kitchenId);
    return ticket;
  }

  public async cancelTicket(id: string): Promise<IKitchenTicket> {
    const ticket = await this.repository.findById(id);
    if (!ticket) throw new NotFoundException('Kitchen Ticket not found');

    if (ticket.status.isImmutable()) {
      throw new ConflictException('Ticket is already immutable');
    }

    ticket.status = new KitchenTicketStatus('Cancelled');
    ticket.updatedAt = new Date();

    await this.repository.save(ticket);
    new KitchenTicketCancelledEvent(ticket.id, ticket.kitchenId);
    return ticket;
  }
}
