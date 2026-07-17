import { ICart } from '../entities/cart.interface';

export class CartCreatedEvent {
  constructor(public readonly cart: ICart) {}
}

export class CartUpdatedEvent {
  constructor(public readonly cart: ICart) {}
}

export class CartCheckedOutEvent {
  constructor(public readonly cartId: string, public readonly orderId?: string) {}
}

export class CartExpiredEvent {
  constructor(public readonly cartId: string) {}
}
