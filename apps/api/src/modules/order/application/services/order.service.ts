import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { IOrder } from '../../domain/entities/order.interface';
import { OrderNumber } from '../../domain/value-objects/order-number.value-object';
import { OrderType, OrderTypeEnum } from '../../domain/value-objects/order-type.value-object';
import { OrderStatus, OrderStatusEnum } from '../../domain/value-objects/order-status.value-object';
import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto';
import { validateCreateOrder, validateUpdateOrder } from '../validation/order.schema';
import { OrderCreatedEvent, OrderCancelledEvent } from '../../domain/events/order.events';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository') private readonly repository: IOrderRepository,
  ) {}

  async create(dto: CreateOrderDto): Promise<IOrder> {
    const errors = validateCreateOrder(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const orderNumberObj = OrderNumber.create(dto.orderNumber);
    
    // Business Rule: Order number must be unique per restaurant
    const existingOrder = await this.repository.findByOrderNumber(dto.restaurantId, orderNumberObj.value);
    if (existingOrder) {
      throw new BadRequestException(`Order number '${orderNumberObj.value}' already exists for this restaurant`);
    }

    const orderTypeObj = OrderType.create(dto.orderType as OrderTypeEnum);
    const orderStatusObj = OrderStatus.create(OrderStatusEnum.DRAFT);

    const order: IOrder = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      branchId: dto.branchId,
      orderNumber: orderNumberObj,
      orderType: orderTypeObj,
      status: orderStatusObj,
      customerId: dto.customerId,
      tableId: dto.tableId,
      cartId: dto.cartId,
      notes: dto.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(order);
    new OrderCreatedEvent(created);
    return created;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<IOrder> {
    const errors = validateUpdateOrder(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const order = await this.repository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Business Rule: Cancelled orders cannot be edited.
    if (!order.status.canBeEdited()) {
      throw new BadRequestException('Cancelled orders cannot be edited');
    }

    const updates: Partial<IOrder> = { updatedAt: new Date() };

    if (dto.orderType) {
      const newOrderType = OrderType.create(dto.orderType as OrderTypeEnum);
      // Business Rule: Confirmed orders cannot change order type.
      if (!order.status.canChangeType() && newOrderType.value !== order.orderType.value) {
        throw new BadRequestException('Confirmed orders cannot change order type');
      }
      updates.orderType = newOrderType;
    }

    if (dto.status) {
      const newStatus = OrderStatus.create(dto.status as OrderStatusEnum);
      updates.status = newStatus;
      
      if (newStatus.value === 'Cancelled' && order.status.value !== 'Cancelled') {
        new OrderCancelledEvent(order.id, order.restaurantId);
      }
    }

    if (dto.customerId !== undefined) updates.customerId = dto.customerId;
    if (dto.tableId !== undefined) updates.tableId = dto.tableId;
    if (dto.notes !== undefined) updates.notes = dto.notes;

    const updated = await this.repository.update(id, updates);
    return updated;
  }
}
