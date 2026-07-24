import { Identifier, DomainPrimitive, ValueObject } from '@saas/domain';

// ENUMS

export enum ProviderStatusEnum {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DEGRADED = 'DEGRADED',
  MAINTENANCE = 'MAINTENANCE'
}

export class ProviderStatus extends DomainPrimitive<ProviderStatusEnum> {
  private constructor(value: ProviderStatusEnum) { super(value); }
  public static create(value: ProviderStatusEnum): ProviderStatus { return new ProviderStatus(value); }
}

export enum ProviderCapabilityEnum {
  FULL_TEXT_SEARCH = 'FULL_TEXT_SEARCH',
  AUTOCOMPLETE = 'AUTOCOMPLETE',
  FACETED_SEARCH = 'FACETED_SEARCH',
  HIGHLIGHTING = 'HIGHLIGHTING',
  GEO_SEARCH = 'GEO_SEARCH',
  VECTOR_SEARCH = 'VECTOR_SEARCH',
  HYBRID_SEARCH = 'HYBRID_SEARCH',
  SYNONYMS = 'SYNONYMS',
  TYPO_TOLERANCE = 'TYPO_TOLERANCE'
}

export class ProviderCapability extends DomainPrimitive<ProviderCapabilityEnum> {
  private constructor(value: ProviderCapabilityEnum) { super(value); }
  public static create(value: ProviderCapabilityEnum): ProviderCapability { return new ProviderCapability(value); }
}

// VALUE OBJECTS

export class ProviderId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ProviderId { return new ProviderId(value); }
  public static generate(): ProviderId { return new ProviderId(crypto.randomUUID()); }
}

export class ProviderName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ProviderName { return new ProviderName(value); }
}

export class ProviderPriority extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ProviderPriority { return new ProviderPriority(value); }
}

export class SearchEngineVersion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SearchEngineVersion { return new SearchEngineVersion(value); }
}

export interface ProviderConfigurationProps {
  endpoint: string;
  credentialsRef: string; // Ref to Secrets Manager
  timeoutMs: number;
  maxRetries: number;
  options?: Record<string, any>;
}

export class ProviderConfiguration extends ValueObject<ProviderConfigurationProps> {
  private constructor(props: ProviderConfigurationProps) { super(props); }
  public static create(props: ProviderConfigurationProps): ProviderConfiguration { return new ProviderConfiguration(props); }
}

export class ProviderLatency extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ProviderLatency { return new ProviderLatency(value); }
}

export class ProviderWeight extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ProviderWeight { return new ProviderWeight(value); }
}

export class ProviderScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ProviderScore { return new ProviderScore(value); }
}

export interface ProviderHealthProps {
  status: ProviderStatusEnum;
  latencyMs: number;
  lastChecked: Date;
  details?: string;
}

export class ProviderHealth extends ValueObject<ProviderHealthProps> {
  private constructor(props: ProviderHealthProps) { super(props); }
  public static create(props: ProviderHealthProps): ProviderHealth { return new ProviderHealth(props); }
}
