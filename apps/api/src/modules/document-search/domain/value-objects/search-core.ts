import { DomainPrimitive } from '@saas/domain';

// ENUMS

export enum IndexStatusEnum {
  PENDING = 'PENDING',
  BUILDING = 'BUILDING',
  READY = 'READY',
  UPDATING = 'UPDATING',
  FAILED = 'FAILED'
}

export class IndexStatus extends DomainPrimitive<IndexStatusEnum> {
  private constructor(value: IndexStatusEnum) { super(value); }
  public static create(value: IndexStatusEnum): IndexStatus {
    return new IndexStatus(value);
  }
}

// VALUE OBJECTS

export class SearchQuery extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SearchQuery {
    return new SearchQuery(value.trim());
  }
}

export interface SearchFilterProps {
  field: string;
  operator: 'EQ' | 'NEQ' | 'GT' | 'LT' | 'GTE' | 'LTE' | 'IN' | 'NIN' | 'CONTAINS';
  value: any;
}

export class SearchFilter extends DomainPrimitive<SearchFilterProps> {
  private constructor(value: SearchFilterProps) { super(value); }
  public static create(value: SearchFilterProps): SearchFilter {
    return new SearchFilter(value);
  }
}

export interface SearchCriteriaProps {
  tenantId: string;
  query?: string;
  filters?: SearchFilterProps[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export class SearchCriteria extends DomainPrimitive<SearchCriteriaProps> {
  private constructor(value: SearchCriteriaProps) { super(value); }
  public static create(value: SearchCriteriaProps): SearchCriteria {
    if (!value.tenantId) throw new Error('SearchCriteria requires a tenantId');
    return new SearchCriteria({
      ...value,
      page: value.page || 1,
      limit: value.limit || 20
    });
  }
}

export class SearchScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): SearchScore {
    return new SearchScore(value);
  }
}

export interface SearchResultItemProps {
  documentId: string;
  score: number;
  highlights?: Record<string, string[]>;
}

export interface SearchResultProps {
  items: SearchResultItemProps[];
  totalHits: number;
  page: number;
  limit: number;
  processingTimeMs: number;
}

export class SearchResult extends DomainPrimitive<SearchResultProps> {
  private constructor(value: SearchResultProps) { super(value); }
  public static create(value: SearchResultProps): SearchResult {
    return new SearchResult(value);
  }
}

export class DocumentTag extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentTag {
    if (!value || value.trim().length === 0) throw new Error('DocumentTag cannot be empty');
    return new DocumentTag(value.trim().toLowerCase());
  }
}

export class DocumentCategory extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DocumentCategory {
    if (!value || value.trim().length === 0) throw new Error('DocumentCategory cannot be empty');
    return new DocumentCategory(value.trim().toUpperCase());
  }
}

export class IndexVersion extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): IndexVersion {
    if (value < 1) throw new Error('IndexVersion must be >= 1');
    return new IndexVersion(value);
  }
}
