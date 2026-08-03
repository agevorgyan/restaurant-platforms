import { DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum QueryStatusEnum {
  PENDING = 'PENDING',
  PARSED = 'PARSED',
  OPTIMIZED = 'OPTIMIZED',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class QueryStatus extends DomainPrimitive<QueryStatusEnum> {
  private constructor(value: QueryStatusEnum) { super(value); }
  public static create(value: QueryStatusEnum): QueryStatus { return new QueryStatus(value); }
}

export enum ExecutionStrategyEnum {
  SINGLE_PROVIDER = 'SINGLE_PROVIDER',
  FEDERATED = 'FEDERATED',
  PARALLEL = 'PARALLEL',
  SEQUENTIAL = 'SEQUENTIAL',
  HYBRID = 'HYBRID'
}

export class ExecutionStrategy extends DomainPrimitive<ExecutionStrategyEnum> {
  private constructor(value: ExecutionStrategyEnum) { super(value); }
  public static create(value: ExecutionStrategyEnum): ExecutionStrategy { return new ExecutionStrategy(value); }
}

// VALUE OBJECTS

export class ParsedQuery extends DomainPrimitive<any> {
  private constructor(value: any) { super(value); }
  public static create(value: any): ParsedQuery { return new ParsedQuery(value); }
}

export interface SearchExpressionProps {
  type: 'AND' | 'OR' | 'NOT';
  predicates: SearchPredicateProps[];
}

export class SearchExpression extends ValueObject<SearchExpressionProps> {
  private constructor(props: SearchExpressionProps) { super(props); }
  public static create(props: SearchExpressionProps): SearchExpression { return new SearchExpression(props); }
}

export interface SearchPredicateProps {
  field: string;
  operator: 'eq' | 'match' | 'range' | 'fuzzy' | 'prefix' | 'geo';
  value: any;
  boost?: number;
}

export class SearchPredicate extends ValueObject<SearchPredicateProps> {
  private constructor(props: SearchPredicateProps) { super(props); }
  public static create(props: SearchPredicateProps): SearchPredicate { return new SearchPredicate(props); }
}

export interface QueryPlanProps {
  stages: ExecutionStageProps[];
  estimatedCost: number;
}

export class QueryPlan extends ValueObject<QueryPlanProps> {
  private constructor(props: QueryPlanProps) { super(props); }
  public static create(props: QueryPlanProps): QueryPlan { return new QueryPlan(props); }
}

export interface ExecutionPlanProps {
  strategy: ExecutionStrategyEnum;
  providers: string[];
  stages: ExecutionStageProps[];
  timeoutMs: number;
}

export class ExecutionPlan extends ValueObject<ExecutionPlanProps> {
  private constructor(props: ExecutionPlanProps) { super(props); }
  public static create(props: ExecutionPlanProps): ExecutionPlan { return new ExecutionPlan(props); }
}

export interface ExecutionStageProps {
  stageId: string;
  targetProvider: string;
  action: string; // e.g., FETCH, AGGREGATE, SCORE
  dependencies: string[];
}

export class ExecutionStage extends ValueObject<ExecutionStageProps> {
  private constructor(props: ExecutionStageProps) { super(props); }
  public static create(props: ExecutionStageProps): ExecutionStage { return new ExecutionStage(props); }
}

export class QueryCost extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): QueryCost { return new QueryCost(value); }
}

export class QueryHint extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): QueryHint { return new QueryHint(value); }
}

export interface QueryContextProps {
  tenantId: string;
  userId: string;
  roles: string[];
}

export class QueryContext extends ValueObject<QueryContextProps> {
  private constructor(props: QueryContextProps) { super(props); }
  public static create(props: QueryContextProps): QueryContext { return new QueryContext(props); }
}

export interface QueryExplanationProps {
  originalQuery: string;
  parsedAst: any;
  rewrittenQuery: any;
  executionPlan: ExecutionPlanProps;
  costEstimate: number;
}

export class QueryExplanation extends ValueObject<QueryExplanationProps> {
  private constructor(props: QueryExplanationProps) { super(props); }
  public static create(props: QueryExplanationProps): QueryExplanation { return new QueryExplanation(props); }
}

export class QueryTimeout extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): QueryTimeout { return new QueryTimeout(value); }
}
