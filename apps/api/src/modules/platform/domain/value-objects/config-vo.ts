/**
 * Enterprise Distributed Configuration Platform - Value Objects
 *
 * Immutable Value Objects encapsulating configuration identity, dot-separated key hierarchy,
 * strongly-typed value containers, namespaces, semantic versions (Major.Minor.Revision),
 * environments, SHA-256 checksums, and point-in-time snapshots.
 */

import { createHash } from 'crypto';
import { ConfigurationType, EnvironmentType } from '../enums/config.enums';
import { InvalidConfigurationSchemaException } from '../exceptions/config.exceptions';

/**
 * ConfigurationId Value Object
 */
export class ConfigurationId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ConfigurationId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): ConfigurationId {
    return new ConfigurationId(id || `cfg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  }

  public static fromString(id: string): ConfigurationId {
    return new ConfigurationId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: ConfigurationId): boolean {
    return this.value === other.getValue();
  }
}

/**
 * ConfigurationKey Value Object (Dot-separated format e.g. "analytics.engine.max_connections")
 */
export class ConfigurationKey {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidConfigurationSchemaException('ConfigurationKey cannot be empty');
    }
    if (!/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(value.trim())) {
      throw new InvalidConfigurationSchemaException(
        `Invalid ConfigurationKey format '${value}'. Must be dot-separated identifiers.`
      );
    }
    this.value = value.trim().toLowerCase();
  }

  public static create(key: string): ConfigurationKey {
    return new ConfigurationKey(key);
  }

  public getValue(): string {
    return this.value;
  }

  public getNamespace(): string {
    const parts = this.value.split('.');
    return parts.length > 1 ? parts.slice(0, -1).join('.') : 'root';
  }
}

/**
 * ConfigurationValue Value Object
 */
export class ConfigurationValue {
  public readonly rawValue: unknown;
  public readonly dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'OBJECT';

  private constructor(rawValue: unknown) {
    if (rawValue === undefined || rawValue === null) {
      throw new InvalidConfigurationSchemaException('ConfigurationValue cannot be undefined or null');
    }
    this.rawValue = rawValue;

    if (typeof rawValue === 'boolean') this.dataType = 'BOOLEAN';
    else if (typeof rawValue === 'number') this.dataType = 'NUMBER';
    else if (typeof rawValue === 'string') this.dataType = 'STRING';
    else if (typeof rawValue === 'object') this.dataType = 'OBJECT';
    else this.dataType = 'JSON';
  }

  public static create(value: unknown): ConfigurationValue {
    return new ConfigurationValue(value);
  }

  public getString(): string {
    return typeof this.rawValue === 'string' ? this.rawValue : JSON.stringify(this.rawValue);
  }

  public getNumber(): number {
    return typeof this.rawValue === 'number' ? this.rawValue : Number(this.rawValue);
  }

  public getBoolean(): boolean {
    return typeof this.rawValue === 'boolean' ? this.rawValue : String(this.rawValue).toLowerCase() === 'true';
  }
}

/**
 * ConfigurationNamespace Value Object
 */
export class ConfigurationNamespace {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidConfigurationSchemaException('ConfigurationNamespace cannot be empty');
    }
    this.value = value.trim().toLowerCase();
  }

  public static create(namespace: string): ConfigurationNamespace {
    return new ConfigurationNamespace(namespace);
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * ConfigurationVersion Value Object (Major.Minor.Revision)
 */
export class ConfigurationVersion {
  public readonly major: number;
  public readonly minor: number;
  public readonly revision: number;

  private constructor(major: number, minor: number, revision: number) {
    if (major < 0 || minor < 0 || revision < 0) {
      throw new Error('ConfigurationVersion components must be non-negative');
    }
    this.major = major;
    this.minor = minor;
    this.revision = revision;
  }

  public static initial(): ConfigurationVersion {
    return new ConfigurationVersion(1, 0, 0);
  }

  public static create(major: number, minor: number, revision: number = 0): ConfigurationVersion {
    return new ConfigurationVersion(major, minor, revision);
  }

  public incrementRevision(): ConfigurationVersion {
    return new ConfigurationVersion(this.major, this.minor, this.revision + 1);
  }

  public incrementMinor(): ConfigurationVersion {
    return new ConfigurationVersion(this.major, this.minor + 1, 0);
  }

  public incrementMajor(): ConfigurationVersion {
    return new ConfigurationVersion(this.major + 1, 0, 0);
  }

  public toString(): string {
    return `${this.major}.${this.minor}.${this.revision}`;
  }
}

/**
 * EnvironmentId Value Object
 */
export class EnvironmentId {
  public readonly envType: EnvironmentType;

  private constructor(envType: EnvironmentType) {
    this.envType = envType;
  }

  public static create(envType: EnvironmentType): EnvironmentId {
    return new EnvironmentId(envType);
  }

  public getValue(): string {
    return this.envType;
  }
}

/**
 * ConfigurationScope Value Object
 */
export class ConfigurationScope {
  public readonly scopeLevel: 'SYSTEM' | 'TENANT' | 'SERVICE';
  public readonly targetId?: string;

  private constructor(scopeLevel: 'SYSTEM' | 'TENANT' | 'SERVICE', targetId?: string) {
    this.scopeLevel = scopeLevel;
    this.targetId = targetId;
  }

  public static create(scopeLevel: 'SYSTEM' | 'TENANT' | 'SERVICE', targetId?: string): ConfigurationScope {
    return new ConfigurationScope(scopeLevel, targetId);
  }

  public static system(): ConfigurationScope {
    return new ConfigurationScope('SYSTEM');
  }

  public static tenant(tenantId: string): ConfigurationScope {
    return new ConfigurationScope('TENANT', tenantId);
  }
}

/**
 * ConfigurationRevision Value Object
 */
export class ConfigurationRevision {
  public readonly revisionNumber: number;

  private constructor(revisionNumber: number) {
    if (revisionNumber < 0) {
      throw new Error('Revision number must be non-negative');
    }
    this.revisionNumber = revisionNumber;
  }

  public static create(revisionNumber: number): ConfigurationRevision {
    return new ConfigurationRevision(revisionNumber);
  }

  public getValue(): number {
    return this.revisionNumber;
  }
}

/**
 * ConfigurationChecksum Value Object (SHA-256)
 */
export class ConfigurationChecksum {
  private readonly value: string;

  private constructor(content: unknown) {
    const jsonStr = typeof content === 'string' ? content : JSON.stringify(content);
    this.value = createHash('sha256').update(jsonStr).digest('hex');
  }

  public static compute(content: unknown): ConfigurationChecksum {
    return new ConfigurationChecksum(content);
  }

  public getValue(): string {
    return this.value;
  }

  public matches(otherChecksum: string): boolean {
    return this.value === otherChecksum;
  }
}

/**
 * ConfigurationSnapshot Value Object
 */
export class ConfigurationSnapshot {
  public readonly snapshotId: string;
  public readonly environment: EnvironmentType;
  public readonly keysCount: number;
  public readonly snapshotHash: string;
  public readonly createdAt: Date;

  private constructor(props: {
    snapshotId?: string;
    environment: EnvironmentType;
    keysCount: number;
    snapshotHash: string;
    createdAt?: Date;
  }) {
    this.snapshotId = props.snapshotId || `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    this.environment = props.environment;
    this.keysCount = props.keysCount;
    this.snapshotHash = props.snapshotHash;
    this.createdAt = props.createdAt || new Date();
  }

  public static create(props: {
    snapshotId?: string;
    environment: EnvironmentType;
    keysCount: number;
    snapshotHash: string;
    createdAt?: Date;
  }): ConfigurationSnapshot {
    return new ConfigurationSnapshot(props);
  }
}
