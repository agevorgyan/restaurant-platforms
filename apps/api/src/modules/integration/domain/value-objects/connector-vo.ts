/**
 * Enterprise Connector Platform - Domain Value Objects
 *
 * Implements immutable domain value objects with strong validation logic.
 * Ensures no external or malformed schemas enter the domain core.
 */

import { randomUUID } from 'crypto';
import { ConnectorType, ConnectorStatus, ConnectorCapability } from '../enums/connector.enums';
import {
  InvalidConfigurationException,
  InvalidCredentialReferenceException,
  ConnectorStateTransitionException,
} from '../exceptions/connector.exceptions';

/**
 * Domain Value Object for Connector Identification.
 */
export class ConnectorId {
  private constructor(private readonly value: string) {}

  public static create(value: string): ConnectorId {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new InvalidConfigurationException('ConnectorId cannot be empty');
    }
    return new ConnectorId(value.trim());
  }

  public static generate(): ConnectorId {
    return new ConnectorId(randomUUID());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ConnectorId): boolean {
    return this.value === other.getValue();
  }
}

/**
 * Domain Value Object for SemVer Connector Versioning.
 */
export class ConnectorVersion {
  private static readonly SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

  private constructor(
    private readonly value: string,
    public readonly major: number,
    public readonly minor: number,
    public readonly patch: number,
    public readonly preRelease?: string
  ) {}

  public static create(versionStr: string): ConnectorVersion {
    const trimmed = versionStr?.trim();
    if (!trimmed || !ConnectorVersion.SEMVER_REGEX.test(trimmed)) {
      throw new InvalidConfigurationException(`Invalid SemVer format for ConnectorVersion: '${versionStr}'`);
    }

    const match = trimmed.match(ConnectorVersion.SEMVER_REGEX);
    if (!match) {
      throw new InvalidConfigurationException(`Failed to parse version: '${versionStr}'`);
    }

    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    const patch = parseInt(match[3], 10);
    const preRelease = match[4] || undefined;

    return new ConnectorVersion(trimmed, major, minor, patch, preRelease);
  }

  public getValue(): string {
    return this.value;
  }

  public isCompatibleWith(target: ConnectorVersion): boolean {
    // Same major version indicates backward compatibility in SemVer
    return this.major === target.major;
  }

  public isGreaterThan(target: ConnectorVersion): boolean {
    if (this.major !== target.major) return this.major > target.major;
    if (this.minor !== target.minor) return this.minor > target.minor;
    return this.patch > target.patch;
  }
}

/**
 * Domain Value Object for Connector Name.
 */
export class ConnectorName {
  private constructor(private readonly value: string) {}

  public static create(name: string): ConnectorName {
    const trimmed = name?.trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 100) {
      throw new InvalidConfigurationException('ConnectorName must be between 2 and 100 characters');
    }
    return new ConnectorName(trimmed);
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * Domain Value Object for Connector Type.
 */
export class ConnectorTypeVO {
  private constructor(private readonly value: ConnectorType) {}

  public static create(typeStr: ConnectorType | string): ConnectorTypeVO {
    const uppercaseType = (typeStr as string)?.toUpperCase();
    if (!Object.values(ConnectorType).includes(uppercaseType as ConnectorType)) {
      throw new InvalidConfigurationException(`Unsupported ConnectorType: '${typeStr}'`);
    }
    return new ConnectorTypeVO(uppercaseType as ConnectorType);
  }

  public getValue(): ConnectorType {
    return this.value;
  }
}

/**
 * Domain Value Object for Connector Capabilities.
 */
export class ConnectorCapabilityVO {
  private constructor(private readonly capabilities: Set<ConnectorCapability>) {}

  public static create(caps: (ConnectorCapability | string)[]): ConnectorCapabilityVO {
    const capSet = new Set<ConnectorCapability>();
    for (const cap of caps || []) {
      const uppercaseCap = (cap as string)?.toUpperCase();
      if (Object.values(ConnectorCapability).includes(uppercaseCap as ConnectorCapability)) {
        capSet.add(uppercaseCap as ConnectorCapability);
      } else {
        throw new InvalidConfigurationException(`Invalid ConnectorCapability: '${cap}'`);
      }
    }
    return new ConnectorCapabilityVO(capSet);
  }

  public has(capability: ConnectorCapability): boolean {
    return this.capabilities.has(capability);
  }

  public toArray(): ConnectorCapability[] {
    return Array.from(this.capabilities);
  }
}

/**
 * Domain Value Object for Credential Reference.
 * CRITICAL RULE: Connector credentials must NEVER be stored here.
 * Store only ConnectorCredentialReference resolved through Enterprise Secrets Platform.
 */
export interface ConnectorCredentialReferenceProps {
  secretArn: string;
  provider: 'HASHICORP_VAULT' | 'AWS_SECRETS_MANAGER' | 'GCP_SECRET_MANAGER' | 'AZURE_KEY_VAULT' | 'CUSTOM_VAULT';
  secretKeyRef: string;
  version?: string;
  updatedAt: Date;
}

export class ConnectorCredentialReference {
  private constructor(private readonly props: ConnectorCredentialReferenceProps) {}

  public static create(props: ConnectorCredentialReferenceProps): ConnectorCredentialReference {
    if (!props || !props.secretArn || props.secretArn.trim().length === 0) {
      throw new InvalidCredentialReferenceException('secretArn is mandatory for ConnectorCredentialReference');
    }
    if (!props.secretKeyRef || props.secretKeyRef.trim().length === 0) {
      throw new InvalidCredentialReferenceException('secretKeyRef is mandatory for ConnectorCredentialReference');
    }
    
    // Strict rejection of inline raw secrets
    const arnLower = props.secretArn.toLowerCase();
    if (
      arnLower.startsWith('sk_') || 
      arnLower.startsWith('pk_') || 
      arnLower.includes('password') || 
      arnLower.includes('bearer ')
    ) {
      throw new InvalidCredentialReferenceException(
        'Raw credential payload detected in secretArn. Connector Platform ONLY accepts Vault secret references.'
      );
    }

    return new ConnectorCredentialReference({
      ...props,
      secretArn: props.secretArn.trim(),
      secretKeyRef: props.secretKeyRef.trim(),
      updatedAt: props.updatedAt || new Date(),
    });
  }

  public getProps(): ConnectorCredentialReferenceProps {
    return { ...this.props };
  }

  public getSecretArn(): string {
    return this.props.secretArn;
  }

  public getProvider(): string {
    return this.props.provider;
  }
}

/**
 * Domain Value Object for Connector Endpoint.
 */
export class ConnectorEndpoint {
  private constructor(
    private readonly baseUrl: string,
    public readonly environment: 'PRODUCTION' | 'SANDBOX' | 'STAGING'
  ) {}

  public static create(baseUrl: string, environment: 'PRODUCTION' | 'SANDBOX' | 'STAGING' = 'PRODUCTION'): ConnectorEndpoint {
    const trimmed = baseUrl?.trim();
    if (!trimmed || !trimmed.startsWith('https://')) {
      throw new InvalidConfigurationException(`ConnectorEndpoint must be a secure HTTPS URL starting with 'https://'. Received: '${baseUrl}'`);
    }

    try {
      new URL(trimmed);
    } catch {
      throw new InvalidConfigurationException(`Malformed ConnectorEndpoint URL: '${baseUrl}'`);
    }

    return new ConnectorEndpoint(trimmed, environment);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}

/**
 * Domain Value Object for Connector Configuration settings.
 */
export interface ConnectorConfigurationProps {
  settings: Record<string, unknown>;
  isSandbox: boolean;
  timeoutMs: number;
  maxRetryAttempts: number;
  allowedEndpoints: string[];
}

export class ConnectorConfiguration {
  private constructor(private readonly props: ConnectorConfigurationProps) {}

  public static create(props: Partial<ConnectorConfigurationProps>): ConnectorConfiguration {
    const settings = props.settings || {};
    const isSandbox = Boolean(props.isSandbox);
    const timeoutMs = props.timeoutMs && props.timeoutMs > 0 ? props.timeoutMs : 5000;
    const maxRetryAttempts = props.maxRetryAttempts && props.maxRetryAttempts >= 0 ? props.maxRetryAttempts : 3;
    const allowedEndpoints = props.allowedEndpoints || [];

    // Ensure allowedEndpoints are HTTPS
    for (const ep of allowedEndpoints) {
      if (!ep.startsWith('https://')) {
        throw new InvalidConfigurationException(`Allowed endpoint must be HTTPS: '${ep}'`);
      }
    }

    return new ConnectorConfiguration({
      settings,
      isSandbox,
      timeoutMs,
      maxRetryAttempts,
      allowedEndpoints,
    });
  }

  public getProps(): ConnectorConfigurationProps {
    return {
      ...this.props,
      settings: JSON.parse(JSON.stringify(this.props.settings)),
    };
  }

  public getSettings(): Record<string, unknown> {
    return JSON.parse(JSON.stringify(this.props.settings));
  }
}

/**
 * Domain Value Object representing a computed Health Score (0 to 100).
 */
export class HealthScore {
  private constructor(private readonly score: number) {}

  public static create(score: number): HealthScore {
    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    return new HealthScore(clamped);
  }

  public static compute(latencyMs: number, successRate: number, failureRate: number): HealthScore {
    // 100 base score
    let score = 100;
    
    // Penalize latency over 200ms
    if (latencyMs > 200) {
      const latencyPenalty = Math.min(40, ((latencyMs - 200) / 1000) * 20);
      score -= latencyPenalty;
    }

    // Penalize failure rate (failure rate is between 0.0 and 1.0)
    score -= failureRate * 60;

    // Boost/scale with success rate
    score = score * (0.4 + 0.6 * successRate);

    return HealthScore.create(score);
  }

  public getValue(): number {
    return this.score;
  }

  public isDegraded(): boolean {
    return this.score < 70 && this.score >= 40;
  }

  public isUnhealthy(): boolean {
    return this.score < 40;
  }
}

/**
 * Domain Value Object for Connector Health monitoring status and metrics.
 */
export interface ConnectorHealthProps {
  isHealthy: boolean;
  healthScore: HealthScore;
  latencyMs: number;
  availabilityRate: number; // 0.0 to 1.0
  failureRate: number;      // 0.0 to 1.0
  successRate: number;      // 0.0 to 1.0
  errorDetails?: string;
  lastCheckedAt: Date;
  lastSuccessfulConnection?: Date;
}

export class ConnectorHealth {
  private constructor(private readonly props: ConnectorHealthProps) {}

  public static create(props: ConnectorHealthProps): ConnectorHealth {
    if (props.latencyMs < 0) {
      throw new InvalidConfigurationException('latencyMs cannot be negative');
    }
    return new ConnectorHealth(props);
  }

  public static initial(): ConnectorHealth {
    return new ConnectorHealth({
      isHealthy: true,
      healthScore: HealthScore.create(100),
      latencyMs: 0,
      availabilityRate: 1.0,
      failureRate: 0.0,
      successRate: 1.0,
      lastCheckedAt: new Date(),
    });
  }

  public getProps(): ConnectorHealthProps {
    return { ...this.props };
  }

  public getScore(): number {
    return this.props.healthScore.getValue();
  }

  public isHealthy(): boolean {
    return this.props.isHealthy;
  }
}

/**
 * Domain Value Object for Connector Status & State Machine transitions.
 */
export class ConnectorStatusVO {
  private static readonly ALLOWED_TRANSITIONS: Record<ConnectorStatus, ConnectorStatus[]> = {
    [ConnectorStatus.DRAFT]: [ConnectorStatus.CONFIGURED, ConnectorStatus.DISABLED, ConnectorStatus.ARCHIVED],
    [ConnectorStatus.CONFIGURED]: [ConnectorStatus.CONNECTED, ConnectorStatus.DRAFT, ConnectorStatus.DISABLED, ConnectorStatus.ARCHIVED],
    [ConnectorStatus.CONNECTED]: [ConnectorStatus.HEALTHY, ConnectorStatus.DEGRADED, ConnectorStatus.DISCONNECTED, ConnectorStatus.DISABLED],
    [ConnectorStatus.HEALTHY]: [ConnectorStatus.DEGRADED, ConnectorStatus.DISCONNECTED, ConnectorStatus.DISABLED],
    [ConnectorStatus.DEGRADED]: [ConnectorStatus.HEALTHY, ConnectorStatus.DISCONNECTED, ConnectorStatus.DISABLED],
    [ConnectorStatus.DISCONNECTED]: [ConnectorStatus.CONNECTED, ConnectorStatus.CONFIGURED, ConnectorStatus.DISABLED, ConnectorStatus.ARCHIVED],
    [ConnectorStatus.DISABLED]: [ConnectorStatus.CONFIGURED, ConnectorStatus.DISCONNECTED, ConnectorStatus.ARCHIVED],
    [ConnectorStatus.ARCHIVED]: [], // Terminal state
  };

  private constructor(private readonly value: ConnectorStatus) {}

  public static create(statusStr: ConnectorStatus | string): ConnectorStatusVO {
    const uppercaseStatus = (statusStr as string)?.toUpperCase();
    if (!Object.values(ConnectorStatus).includes(uppercaseStatus as ConnectorStatus)) {
      throw new InvalidConfigurationException(`Invalid ConnectorStatus: '${statusStr}'`);
    }
    return new ConnectorStatusVO(uppercaseStatus as ConnectorStatus);
  }

  public getValue(): ConnectorStatus {
    return this.value;
  }

  public canTransitionTo(target: ConnectorStatus): boolean {
    const allowed = ConnectorStatusVO.ALLOWED_TRANSITIONS[this.value] || [];
    return allowed.includes(target);
  }

  public transitionTo(target: ConnectorStatus, reason?: string): ConnectorStatusVO {
    if (this.value === target) return this;
    if (!this.canTransitionTo(target)) {
      throw new ConnectorStateTransitionException(this.value, target, reason);
    }
    return ConnectorStatusVO.create(target);
  }
}

/**
 * Domain Value Object for Signed Connector Metadata.
 */
export interface ConnectorMetadataProps {
  description: string;
  provider: string;
  license: string;
  documentationUrl?: string;
  tags: string[];
  signature?: string;
  signedAt?: Date;
}

export class ConnectorMetadata {
  private constructor(private readonly props: ConnectorMetadataProps) {}

  public static create(props: ConnectorMetadataProps): ConnectorMetadata {
    const description = props.description?.trim() || '';
    const provider = props.provider?.trim() || 'Unknown Provider';
    const license = props.license?.trim() || 'Proprietary';
    const tags = Array.isArray(props.tags) ? props.tags.map(t => t.trim()) : [];

    return new ConnectorMetadata({
      description,
      provider,
      license,
      documentationUrl: props.documentationUrl,
      tags,
      signature: props.signature,
      signedAt: props.signedAt,
    });
  }

  public getProps(): ConnectorMetadataProps {
    return { ...this.props, tags: [...this.props.tags] };
  }
}
