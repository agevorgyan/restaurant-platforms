import { Entity } from '@saas/core';
import { SettlementReferenceId } from '../value-objects/settlement-reference-id.value-object';

export interface SettlementReferenceProps {
  reference: SettlementReferenceId;
  createdAt: Date;
}

export class SettlementReference extends Entity<SettlementReferenceProps> {
  private constructor(props: SettlementReferenceProps, id?: string) {
    super(id || crypto.randomUUID(), props);
  }

  public static create(reference: SettlementReferenceId, id?: string): SettlementReference {
    if (!reference) {
      throw new Error('SettlementReference must have a valid reference ID');
    }
    
    return new SettlementReference({
      reference,
      createdAt: new Date()
    }, id);
  }

  get reference(): SettlementReferenceId { return this.props.reference; }
  get createdAt(): Date { return this.props.createdAt; }
}
