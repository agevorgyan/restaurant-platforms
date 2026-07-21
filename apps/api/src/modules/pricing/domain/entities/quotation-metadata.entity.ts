import { Entity } from '@saas/core';
import { QuotationSource } from '../value-objects/quotation-source.value-object';

export interface QuotationMetadataProps {
  source: QuotationSource;
  restaurantId: string;
  customerId?: string;
  orderChannel: string;
  deliveryMethod: string;
  deviceFingerprint?: string;
}

export class QuotationMetadata extends Entity<QuotationMetadataProps> {
  private constructor(id: string, props: QuotationMetadataProps) {
    super(id, props);
  }

  public static create(id: string, props: QuotationMetadataProps): QuotationMetadata {
    if (!props.restaurantId) {
      throw new Error('Restaurant ID is required in quotation metadata');
    }
    return new QuotationMetadata(id, props);
  }

  get source(): QuotationSource { return this.props.source; }
  get restaurantId(): string { return this.props.restaurantId; }
  get customerId(): string | undefined { return this.props.customerId; }
  get orderChannel(): string { return this.props.orderChannel; }
  get deliveryMethod(): string { return this.props.deliveryMethod; }
  get deviceFingerprint(): string | undefined { return this.props.deviceFingerprint; }
}
