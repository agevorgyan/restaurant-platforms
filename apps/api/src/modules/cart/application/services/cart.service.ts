import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ICartRepository } from '../../domain/repositories/cart.repository.interface';
import { ICart } from '../../domain/entities/cart.interface';
import { ICartItem } from '../../domain/entities/cart-item.interface';
import { CartTotals } from '../../domain/value-objects/cart-totals.value-object';
import { CartStatus } from '../../domain/value-objects/cart-status.value-object';
import { CartExpiration } from '../../domain/value-objects/cart-expiration.value-object';
import { CreateCartDto, AddCartItemDto, CheckoutCartDto } from '../dto/cart.dto';
import { validateCreateCart, validateAddCartItem } from '../validation/cart.schema';
import { CartCreatedEvent, CartUpdatedEvent, CartCheckedOutEvent, CartExpiredEvent } from '../../domain/events/cart.events';

@Injectable()
export class CartService {
  constructor(
    @Inject('ICartRepository') private readonly repository: ICartRepository,
  ) {}

  async create(dto: CreateCartDto): Promise<ICart> {
    const errors = validateCreateCart(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const expiresAtDate = new Date();
    // Default expiration to 60 minutes if not provided
    expiresAtDate.setMinutes(expiresAtDate.getMinutes() + (dto.expiresInMinutes || 60));
    const expiration = new CartExpiration(expiresAtDate);

    const cart: ICart = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      branchId: dto.branchId,
      customerId: dto.customerId,
      sessionId: dto.sessionId,
      tableId: dto.tableId,
      currency: dto.currency,
      status: new CartStatus('Active'),
      items: [],
      totals: new CartTotals([]),
      expiresAt: expiration,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(cart);
    new CartCreatedEvent(created);
    return created;
  }

  async addItem(cartId: string, dto: AddCartItemDto): Promise<ICart> {
    const errors = validateAddCartItem(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const cart = await this.repository.findById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    // Business Rule: Expired carts cannot be modified. Checked-out carts become read-only.
    if (cart.expiresAt.isExpired()) {
      // Transition to expired if it isn't already
      if (cart.status.value !== 'Expired') {
        await this.repository.update(cartId, { status: new CartStatus('Expired') });
        new CartExpiredEvent(cartId);
      }
      throw new BadRequestException('Expired carts cannot be modified');
    }

    if (cart.status.isReadOnly()) {
      throw new BadRequestException(`Cart is read-only (Status: ${cart.status.value})`);
    }

    const modifiers = dto.modifierSelections || [];
    const modifiersTotal = modifiers.reduce((sum, mod) => sum + mod.priceAdjustment * mod.quantity, 0);
    const lineTotal = (dto.unitPrice * dto.quantity) + (modifiersTotal * dto.quantity);

    const cartItem: ICartItem = {
      id: crypto.randomUUID(),
      productId: dto.productId,
      quantity: dto.quantity,
      modifierSelections: modifiers,
      specialInstructions: dto.specialInstructions,
      unitPrice: dto.unitPrice,
      lineTotal,
    };

    const updatedItems = [...cart.items, cartItem];
    const newTotals = new CartTotals(updatedItems.map(item => item.lineTotal));

    const updatedCart = await this.repository.update(cartId, {
      items: updatedItems,
      totals: newTotals,
      updatedAt: new Date(),
    });

    new CartUpdatedEvent(updatedCart);
    return updatedCart;
  }

  async checkout(cartId: string, dto: CheckoutCartDto): Promise<ICart> {
    const cart = await this.repository.findById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    // Business Rule: Only Active carts may be checked out.
    if (!cart.status.canCheckout()) {
      throw new BadRequestException(`Only Active carts may be checked out. Current status: ${cart.status.value}`);
    }

    if (cart.expiresAt.isExpired()) {
      await this.repository.update(cartId, { status: new CartStatus('Expired') });
      new CartExpiredEvent(cartId);
      throw new BadRequestException('Cannot checkout an expired cart');
    }

    const updatedCart = await this.repository.update(cartId, {
      status: new CartStatus('CheckedOut'),
      updatedAt: new Date(),
    });

    new CartCheckedOutEvent(cartId, dto.orderId);
    return updatedCart;
  }
}
