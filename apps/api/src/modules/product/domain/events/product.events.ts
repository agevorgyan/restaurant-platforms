import { IProduct } from '../entities/product.interface';

export class ProductCreatedEvent {
  constructor(public readonly product: IProduct) {}
}

export class ProductUpdatedEvent {
  constructor(public readonly product: IProduct) {}
}

export class ProductArchivedEvent {
  constructor(public readonly productId: string, public readonly restaurantId: string) {}
}
