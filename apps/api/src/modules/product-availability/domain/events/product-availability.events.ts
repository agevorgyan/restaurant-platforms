import { ProductAvailabilityPolicy } from '../value-objects/product-availability-policy.value-object';

export class ProductAvailabilityUpdatedEvent {
  constructor(
    public readonly productId: string,
    public readonly policy: ProductAvailabilityPolicy
  ) {}
}
