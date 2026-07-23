import { ValueObject } from '@saas/core';

export interface CatalogReferenceProps { catalogId: string; }

export class CatalogReference extends ValueObject<CatalogReferenceProps> {
  get catalogId(): string { return this.props.catalogId; }
  private constructor(props: CatalogReferenceProps) { super(props); }
  public static create(catalogId: string): CatalogReference {
    if (!catalogId) throw new Error('CatalogReference cannot be empty');
    return new CatalogReference({ catalogId });
  }
}