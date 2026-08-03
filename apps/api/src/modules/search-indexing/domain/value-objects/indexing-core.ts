import { Identifier, DomainPrimitive } from '@saas/domain';
import { ValueObject } from '@saas/core';

// ENUMS

export enum IndexStatusEnum {
  PENDING = 'PENDING',
  BUILDING = 'BUILDING',
  READY = 'READY',
  UPDATING = 'UPDATING',
  FAILED = 'FAILED',
  ARCHIVED = 'ARCHIVED'
}

export class IndexStatus extends DomainPrimitive<IndexStatusEnum> {
  private constructor(value: IndexStatusEnum) { super(value); }
  public static create(value: IndexStatusEnum): IndexStatus { return new IndexStatus(value); }
}

export enum IndexOperationEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  REINDEX = 'REINDEX',
  OPTIMIZE = 'OPTIMIZE',
  SWAP_ALIAS = 'SWAP_ALIAS'
}

export class IndexOperation extends DomainPrimitive<IndexOperationEnum> {
  private constructor(value: IndexOperationEnum) { super(value); }
  public static create(value: IndexOperationEnum): IndexOperation { return new IndexOperation(value); }
}

// VALUE OBJECTS

export class IndexId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): IndexId { return new IndexId(value); }
  public static generate(): IndexId { return new IndexId(crypto.randomUUID()); }
}

export class IndexName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): IndexName { return new IndexName(value); }
}

export class IndexVersion extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): IndexVersion { return new IndexVersion(value); }
}

export class IndexAlias extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): IndexAlias { return new IndexAlias(value); }
}

export class IndexJobId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): IndexJobId { return new IndexJobId(value); }
  public static generate(): IndexJobId { return new IndexJobId(crypto.randomUUID()); }
}

export interface IndexBatchProps {
  batchId: string;
  operations: Array<{ type: 'UPSERT' | 'DELETE'; id: string; body?: any }>;
}

export class IndexBatch extends ValueObject<IndexBatchProps> {
  private constructor(props: IndexBatchProps) { super(props); }
  public static create(props: IndexBatchProps): IndexBatch { return new IndexBatch(props); }
}

export interface ReindexRequestProps {
  sourceIndex: string;
  targetIndex: string;
  query?: any;
}

export class ReindexRequest extends ValueObject<ReindexRequestProps> {
  private constructor(props: ReindexRequestProps) { super(props); }
  public static create(props: ReindexRequestProps): ReindexRequest { return new ReindexRequest(props); }
}

export interface IndexStatisticsProps {
  indexName: string;
  documentCount: number;
  storeSizeBytes: number;
  deletedDocuments: number;
}

export class IndexStatistics extends ValueObject<IndexStatisticsProps> {
  private constructor(props: IndexStatisticsProps) { super(props); }
  public static create(props: IndexStatisticsProps): IndexStatistics { return new IndexStatistics(props); }
}

export interface IndexHealthProps {
  indexName: string;
  status: 'green' | 'yellow' | 'red';
  unassignedShards: number;
}

export class IndexHealth extends ValueObject<IndexHealthProps> {
  private constructor(props: IndexHealthProps) { super(props); }
  public static create(props: IndexHealthProps): IndexHealth { return new IndexHealth(props); }
}
