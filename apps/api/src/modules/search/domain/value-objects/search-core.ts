import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum SearchStatusEnum {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class SearchStatus extends DomainPrimitive<SearchStatusEnum> {
  private constructor(value: SearchStatusEnum) { super(value); }
  public static create(value: SearchStatusEnum): SearchStatus { return new SearchStatus(value); }
}

export enum SearchScopeEnum {
  GLOBAL = 'GLOBAL',
  TENANT = 'TENANT',
  MODULE = 'MODULE',
  USER = 'USER'
}

export class SearchScope extends DomainPrimitive<SearchScopeEnum> {
  private constructor(value: SearchScopeEnum) { super(value); }
  public static create(value: SearchScopeEnum): SearchScope { return new SearchScope(value); }
}

// VALUE OBJECTS

export class SearchQuery extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SearchQuery { return new SearchQuery(value); }
}

export class SearchTerm extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SearchTerm { return new SearchTerm(value); }
}

export interface SearchFilterProps {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';
  value: any;
}

export class SearchFilter extends ValueObject<SearchFilterProps> {
  private constructor(props: SearchFilterProps) { super(props); }
  public static create(props: SearchFilterProps): SearchFilter { return new SearchFilter(props); }
}

export interface SearchCriteriaProps {
  tenantId: string;
  query: string;
  filters?: SearchFilterProps[];
  scope: SearchScopeEnum;
  modules?: string[];
  limit: number;
  cursor?: string;
}

export class SearchCriteria extends ValueObject<SearchCriteriaProps> {
  private constructor(props: SearchCriteriaProps) { super(props); }
  public static create(props: SearchCriteriaProps): SearchCriteria { return new SearchCriteria(props); }
}

export interface SearchHitProps {
  id: string;
  module: string;
  type: string;
  title: string;
  description?: string;
  score: number;
  metadata: Record<string, any>;
  url?: string;
}

export class SearchHit extends ValueObject<SearchHitProps> {
  private constructor(props: SearchHitProps) { super(props); }
  public static create(props: SearchHitProps): SearchHit { return new SearchHit(props); }
}

export interface SearchFacetProps {
  field: string;
  counts: Array<{ value: string; count: number }>;
}

export class SearchFacet extends ValueObject<SearchFacetProps> {
  private constructor(props: SearchFacetProps) { super(props); }
  public static create(props: SearchFacetProps): SearchFacet { return new SearchFacet(props); }
}

export interface SearchResultProps {
  query: string;
  hits: SearchHitProps[];
  facets: SearchFacetProps[];
  totalHits: number;
  tookMs: number;
  nextCursor?: string;
}

export class SearchResult extends ValueObject<SearchResultProps> {
  private constructor(props: SearchResultProps) { super(props); }
  public static create(props: SearchResultProps): SearchResult { return new SearchResult(props); }
}

export class SearchRanking extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): SearchRanking { return new SearchRanking(value); }
}

export interface SearchSuggestionProps {
  term: string;
  score: number;
  moduleHint?: string;
}

export class SearchSuggestion extends ValueObject<SearchSuggestionProps> {
  private constructor(props: SearchSuggestionProps) { super(props); }
  public static create(props: SearchSuggestionProps): SearchSuggestion { return new SearchSuggestion(props); }
}

export class SearchCursor extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SearchCursor { return new SearchCursor(value); }
}

export class SearchSessionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SearchSessionId { return new SearchSessionId(value); }
  public static generate(): SearchSessionId { return new SearchSessionId(crypto.randomUUID()); }
}
