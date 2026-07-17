import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { IKitchenQueueRepository } from '../repositories/kitchen-queue.repository.interface';
import { CreateKitchenQueueDto, EnqueueTicketDto, ReorderTicketDto } from '../../application/dto/kitchen-queue.dto';
import { validateCreateKitchenQueue, validateEnqueueTicket, validateReorderTicket } from '../../application/validation/kitchen-queue.schema';
import { IKitchenQueue, IQueuedTicket } from '../entities/kitchen-queue.interface';
import { QueueCapacity } from '../value-objects/queue-capacity.value-object';
import { QueuePriority } from '../value-objects/queue-priority.value-object';
import { QueuePosition } from '../value-objects/queue-position.value-object';
import { QueueStrategyType } from '../strategies/queue-strategy.interface';
import {
  TicketQueuedEvent,
  TicketDequeuedEvent,
  TicketReorderedEvent,
  QueueCapacityReachedEvent
} from '../events/kitchen-queue.events';

@Injectable()
export class KitchenQueueDomainService {
  constructor(private readonly repository: IKitchenQueueRepository) {}

  public async createQueue(id: string, dto: CreateKitchenQueueDto): Promise<IKitchenQueue> {
    const errors = validateCreateKitchenQueue(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const existing = await this.repository.findByStationId(dto.stationId);
    if (existing) {
      throw new ConflictException(`A queue already exists for station ${dto.stationId}`);
    }

    if (!['FIFO', 'Priority', 'Hybrid'].includes(dto.strategy)) {
      throw new BadRequestException(`Invalid queue strategy: ${dto.strategy}`);
    }

    const queue: IKitchenQueue = {
      id,
      restaurantId: dto.restaurantId,
      branchId: dto.branchId,
      kitchenId: dto.kitchenId,
      stationId: dto.stationId,
      strategy: dto.strategy as QueueStrategyType,
      capacity: new QueueCapacity(dto.capacity),
      tickets: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(queue);
    return queue;
  }

  public async enqueueTicket(queueId: string, dto: EnqueueTicketDto, ticketStatus: string): Promise<IKitchenQueue> {
    const errors = validateEnqueueTicket(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    if (ticketStatus !== 'Queued') {
      throw new ConflictException('Only tickets in Queued state may enter the queue');
    }

    const queue = await this.getQueue(queueId);

    if (queue.tickets.find(t => t.ticketId === dto.ticketId)) {
      throw new ConflictException('Ticket is already in the queue');
    }

    if (queue.capacity.isExceeded(queue.tickets.length)) {
      throw new ConflictException('Queue capacity exceeded');
    }

    const ticket: IQueuedTicket = {
      ticketId: dto.ticketId,
      priority: new QueuePriority(dto.priority as any),
      position: new QueuePosition(0),
      enteredAt: new Date()
    };

    if (queue.strategy === 'FIFO') {
      queue.tickets.push(ticket);
    } else {
      const insertIndex = queue.tickets.findIndex(t => t.priority.getWeight() < ticket.priority.getWeight());
      if (insertIndex === -1) {
        queue.tickets.push(ticket);
      } else {
        queue.tickets.splice(insertIndex, 0, ticket);
      }
    }

    this.recalculatePositions(queue);

    if (queue.capacity.isExceeded(queue.tickets.length)) {
      new QueueCapacityReachedEvent(queue.id, queue.stationId);
    }

    queue.updatedAt = new Date();
    await this.repository.save(queue);
    
    new TicketQueuedEvent(queue.id, ticket.ticketId);
    return queue;
  }

  public async dequeueTicket(queueId: string, ticketId: string): Promise<IKitchenQueue> {
    const queue = await this.getQueue(queueId);
    
    const index = queue.tickets.findIndex(t => t.ticketId === ticketId);
    if (index === -1) {
      throw new NotFoundException('Ticket not found in queue');
    }

    queue.tickets.splice(index, 1);
    this.recalculatePositions(queue);
    queue.updatedAt = new Date();

    await this.repository.save(queue);
    new TicketDequeuedEvent(queue.id, ticketId);
    
    return queue;
  }

  public async removeCompletedOrCancelledTicket(queueId: string, ticketId: string, status: string): Promise<IKitchenQueue> {
    if (status !== 'Completed' && status !== 'Cancelled') {
      throw new ConflictException('Only Completed or Cancelled tickets can be removed via this method');
    }
    return this.dequeueTicket(queueId, ticketId);
  }

  public async reorderTicket(queueId: string, dto: ReorderTicketDto): Promise<IKitchenQueue> {
    const errors = validateReorderTicket(dto);
    if (errors.length > 0) throw new BadRequestException(errors);

    const queue = await this.getQueue(queueId);

    if (queue.strategy === 'FIFO') {
      throw new ConflictException('Reordering is not allowed for FIFO strategy');
    }

    const index = queue.tickets.findIndex(t => t.ticketId === dto.ticketId);
    if (index === -1) {
      throw new NotFoundException('Ticket not found in queue');
    }

    const targetPosition = Math.min(dto.newPosition, queue.tickets.length - 1);
    const [ticket] = queue.tickets.splice(index, 1);
    queue.tickets.splice(targetPosition, 0, ticket);

    this.recalculatePositions(queue);
    queue.updatedAt = new Date();

    await this.repository.save(queue);
    new TicketReorderedEvent(queue.id, ticket.ticketId);
    
    return queue;
  }

  private recalculatePositions(queue: IKitchenQueue): void {
    queue.tickets.forEach((ticket, idx) => {
      ticket.position = new QueuePosition(idx);
    });
  }

  private async getQueue(id: string): Promise<IKitchenQueue> {
    const queue = await this.repository.findById(id);
    if (!queue) throw new NotFoundException('Kitchen Queue not found');
    return queue;
  }
}
