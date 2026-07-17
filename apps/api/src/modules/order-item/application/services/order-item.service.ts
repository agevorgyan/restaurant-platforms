import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderItemRepository } from '../../domain/repositories/order-item.repository.interface';
import { IOrderItem } from '../../domain/entities/order-item.interface';
import { OrderItemSnapshot } from '../../domain/value-objects/order-item-snapshot.value-object';
import { OrderItemModifier } from '../../domain/value-objects/order-item-modifier.value-object';
import { OrderItemPrice } from '../../domain/value-objects/order-item-price.value-object';
import { OrderItemStatus, OrderItemStatusType } from '../../domain/value-objects/order-item-status.value-object';
import { AddOrderItemDto, UpdateOrderItemDto } from '../dto/order-item.dto';
import { validateAddOrderItem, validateUpdateOrderItem } from '../validation/order-item.schema';
import { OrderItemAddedEvent, OrderItemUpdatedEvent, OrderItemRemovedEvent } from '../../domain/events/order-item.events';

@Injectable()
export class OrderItemService {
  constructor(
    @Inject('IOrderItemRepository') private readonly repository: IOrderItemRepository,
  ) {}

  async add(dto: AddOrderItemDto): Promise<IOrderItem> {
    const errors = validateAddOrderItem(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const snapshot = new OrderItemSnapshot(
      dto.productSnapshot.productId,
      dto.productSnapshot.name,
      dto.productSnapshot.sku,
      dto.productSnapshot.description,
      dto.productSnapshot.imageUrl,
      dto.productSnapshot.categoryName,
      dto.productSnapshot.taxCategory
    );

    const modifiers = (dto.modifierSelections || []).map(m => new OrderItemModifier(
      m.modifierGroupId,
      m.modifierOptionId,
      m.name,
      m.quantity,
      m.priceAdjustment
    ));

    const price = new OrderItemPrice(dto.unitPrice, dto.quantity, modifiers);
    const status = new OrderItemStatus('Pending');

    const orderItem: IOrderItem = {
      id: crypto.randomUUID(),
      orderId: dto.orderId,
      productId: dto.productId,
      productSnapshot: snapshot,
      quantity: dto.quantity,
      unitPrice: price.unitPrice,
      totalPrice: price.totalPrice,
      modifierSelections: modifiers,
      specialInstructions: dto.specialInstructions,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const added = await this.repository.create(orderItem);
    new OrderItemAddedEvent(added);
    return added;
  }

  async update(id: string, dto: UpdateOrderItemDto): Promise<IOrderItem> {
    const errors = validateUpdateOrderItem(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const orderItem = await this.repository.findById(id);
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    // Business Rule: Cancelled order items cannot be edited.
    if (!orderItem.status.canBeEdited()) {
      throw new BadRequestException('Cancelled order items cannot be edited');
    }

    const updates: Partial<IOrderItem> = { updatedAt: new Date() };
    
    // Process status update if provided
    let updatedStatus = orderItem.status;
    if (dto.status) {
      updatedStatus = new OrderItemStatus(dto.status as OrderItemStatusType);
      updates.status = updatedStatus;
    }

    // Determine current/new quantity
    const finalQuantity = dto.quantity !== undefined ? dto.quantity : orderItem.quantity;

    // Determine current/new modifiers
    let finalModifiers = orderItem.modifierSelections;
    if (dto.modifierSelections) {
      // Business Rule: Modifier selections are immutable after confirmation.
      if (orderItem.status.areModifiersImmutable()) {
        throw new BadRequestException('Modifier selections are immutable after confirmation');
      }

      finalModifiers = dto.modifierSelections.map(m => new OrderItemModifier(
        m.modifierGroupId,
        m.modifierOptionId,
        m.name,
        m.quantity,
        m.priceAdjustment
      ));
      updates.modifierSelections = finalModifiers;
    }

    // Recalculate price if quantity or modifiers changed
    if (dto.quantity !== undefined || dto.modifierSelections !== undefined) {
      updates.quantity = finalQuantity;
      const newPrice = new OrderItemPrice(orderItem.unitPrice, finalQuantity, finalModifiers);
      updates.totalPrice = newPrice.totalPrice;
    }

    if (dto.specialInstructions !== undefined) {
      updates.specialInstructions = dto.specialInstructions;
    }

    const updated = await this.repository.update(id, updates);
    new OrderItemUpdatedEvent(updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const orderItem = await this.repository.findById(id);
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }

    if (!orderItem.status.canBeEdited()) {
      throw new BadRequestException('Cancelled order items cannot be removed');
    }

    await this.repository.remove(id);
    new OrderItemRemovedEvent(id, orderItem.orderId);
  }
}
