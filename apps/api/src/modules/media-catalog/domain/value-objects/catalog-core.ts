import { Identifier, DomainPrimitive } from '@saas/domain';

// ENUMS

export enum CatalogStatusEnum {
  PENDING = 'PENDING',
  READY = 'READY',
  UPDATING = 'UPDATING',
  FAILED = 'FAILED'
}

export class CatalogStatus extends DomainPrimitive<CatalogStatusEnum> {
  private constructor(value: CatalogStatusEnum) { super(value); }
  public static create(value: CatalogStatusEnum): CatalogStatus { return new CatalogStatus(value); }
}

// VALUE OBJECTS

export class AlbumId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AlbumId { return new AlbumId(value); }
  public static generate(): AlbumId { return new AlbumId(crypto.randomUUID()); }
}

export class CollectionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CollectionId { return new CollectionId(value); }
  public static generate(): CollectionId { return new CollectionId(crypto.randomUUID()); }
}

export class CatalogEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CatalogEntryId { return new CatalogEntryId(value); }
  public static generate(): CatalogEntryId { return new CatalogEntryId(crypto.randomUUID()); }
}

export class IndexVersion extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): IndexVersion { return new IndexVersion(value); }
}

export class MediaTag extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MediaTag {
    return new MediaTag(value.toLowerCase().trim());
  }
}

export class MediaCategory extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MediaCategory { return new MediaCategory(value); }
}

export class MediaSearchQuery extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): MediaSearchQuery { return new MediaSearchQuery(value); }
}

export interface MediaSearchFilterProps {
  field: string;
  operator: 'eq' | 'neq' | 'in' | 'gt' | 'lt';
  value: any;
}

export class MediaSearchFilter extends DomainPrimitive<MediaSearchFilterProps> {
  private constructor(value: MediaSearchFilterProps) { super(value); }
  public static create(value: MediaSearchFilterProps): MediaSearchFilter { return new MediaSearchFilter(value); }
}

export interface MediaSearchCriteriaProps {
  tenantId: string;
  query?: string;
  filters?: MediaSearchFilterProps[];
  tags?: string[];
  categories?: string[];
  page: number;
  limit: number;
}

export class MediaSearchCriteria extends DomainPrimitive<MediaSearchCriteriaProps> {
  private constructor(value: MediaSearchCriteriaProps) { super(value); }
  public static create(value: MediaSearchCriteriaProps): MediaSearchCriteria { return new MediaSearchCriteria(value); }
}

export interface MediaSearchResultProps {
  mediaId: string;
  tenantId: string;
  score: number;
  highlight?: Record<string, string[]>;
}

export class MediaSearchResult extends DomainPrimitive<MediaSearchResultProps> {
  private constructor(value: MediaSearchResultProps) { super(value); }
  public static create(value: MediaSearchResultProps): MediaSearchResult { return new MediaSearchResult(value); }
}
