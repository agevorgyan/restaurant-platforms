import { Identifier, DomainPrimitive, ValueObject } from '@saas/domain';

// ENUMS

export enum OptimizationStatusEnum {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class OptimizationStatus extends DomainPrimitive<OptimizationStatusEnum> {
  private constructor(value: OptimizationStatusEnum) { super(value); }
  public static create(value: OptimizationStatusEnum): OptimizationStatus { return new OptimizationStatus(value); }
}

export enum SuggestionTypeEnum {
  RELEVANCE = 'RELEVANCE',
  SYNONYM = 'SYNONYM',
  INDEX = 'INDEX',
  RANKING = 'RANKING',
  AUTOCOMPLETE = 'AUTOCOMPLETE',
  PERFORMANCE = 'PERFORMANCE'
}

export class SuggestionType extends DomainPrimitive<SuggestionTypeEnum> {
  private constructor(value: SuggestionTypeEnum) { super(value); }
  public static create(value: SuggestionTypeEnum): SuggestionType { return new SuggestionType(value); }
}

// VALUE OBJECTS

export class AnalyticsSessionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AnalyticsSessionId { return new AnalyticsSessionId(value); }
  public static generate(): AnalyticsSessionId { return new AnalyticsSessionId(crypto.randomUUID()); }
}

export interface SearchMetricProps {
  query: string;
  count: number;
  date: Date;
}

export class SearchMetric extends ValueObject<SearchMetricProps> {
  private constructor(props: SearchMetricProps) { super(props); }
  public static create(props: SearchMetricProps): SearchMetric { return new SearchMetric(props); }
}

export interface SearchTrendProps {
  query: string;
  growthPercentage: number;
  timeframe: string;
}

export class SearchTrend extends ValueObject<SearchTrendProps> {
  private constructor(props: SearchTrendProps) { super(props); }
  public static create(props: SearchTrendProps): SearchTrend { return new SearchTrend(props); }
}

export class RelevanceScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): RelevanceScore { return new RelevanceScore(value); }
}

export interface OptimizationSuggestionProps {
  id: string;
  type: SuggestionTypeEnum;
  description: string;
  impactScore: number; // 1-100
  metadata?: Record<string, any>;
}

export class OptimizationSuggestion extends ValueObject<OptimizationSuggestionProps> {
  private constructor(props: OptimizationSuggestionProps) { super(props); }
  public static create(props: OptimizationSuggestionProps): OptimizationSuggestion { return new OptimizationSuggestion(props); }
}

export interface QueryPerformanceProps {
  queryId: string;
  rawQuery: string;
  latencyMs: number;
  cpuUsage?: number;
}

export class QueryPerformance extends ValueObject<QueryPerformanceProps> {
  private constructor(props: QueryPerformanceProps) { super(props); }
  public static create(props: QueryPerformanceProps): QueryPerformance { return new QueryPerformance(props); }
}

export class ClickThroughRate extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ClickThroughRate { return new ClickThroughRate(value); }
}

export interface ZeroResultMetricProps {
  query: string;
  frequency: number;
  lastOccurred: Date;
}

export class ZeroResultMetric extends ValueObject<ZeroResultMetricProps> {
  private constructor(props: ZeroResultMetricProps) { super(props); }
  public static create(props: ZeroResultMetricProps): ZeroResultMetric { return new ZeroResultMetric(props); }
}

export class LatencyMetric extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): LatencyMetric { return new LatencyMetric(value); }
}
