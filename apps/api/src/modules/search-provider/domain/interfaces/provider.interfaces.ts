export interface SearchProvider {
  search(index: string, query: any): Promise<any>;
  suggest(index: string, prefix: string): Promise<any>;
}

export interface IndexProvider {
  createIndex(name: string, schema: any): Promise<void>;
  deleteIndex(name: string): Promise<void>;
  indexDocument(index: string, id: string, document: any): Promise<void>;
  deleteDocument(index: string, id: string): Promise<void>;
  bulkIndex(index: string, operations: any[]): Promise<void>;
  swapAlias(alias: string, targetIndex: string): Promise<void>;
}

export interface HealthProvider {
  ping(): Promise<boolean>;
  getHealth(): Promise<{ status: string; latencyMs: number }>;
}

export interface CapabilityProvider {
  supports(capability: string): boolean;
  getCapabilities(): string[];
}
