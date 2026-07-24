import { Identifier, DomainPrimitive } from '@saas/domain';

export class ConnectorId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ConnectorId { return new ConnectorId(value); }
  public static generate(): ConnectorId { return new ConnectorId(crypto.randomUUID()); }
}

export class ConnectorCode extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ConnectorCode {
    if (!value || value.trim() === '') throw new Error('ConnectorCode cannot be empty');
    return new ConnectorCode(value.toUpperCase());
  }
}

export enum ConnectorTypeEnum {
  PAYMENT = 'PAYMENT',
  DELIVERY = 'DELIVERY',
  POS = 'POS',
  ACCOUNTING = 'ACCOUNTING',
  CRM = 'CRM',
  ERP = 'ERP',
  MARKETING = 'MARKETING',
  NOTIFICATION = 'NOTIFICATION',
  IDENTITY = 'IDENTITY',
  ANALYTICS = 'ANALYTICS',
  STORAGE = 'STORAGE',
  CUSTOM = 'CUSTOM'
}

export class ConnectorType extends DomainPrimitive<ConnectorTypeEnum> {
  private constructor(value: ConnectorTypeEnum) { super(value); }
  public static create(value: ConnectorTypeEnum): ConnectorType {
    if (!Object.values(ConnectorTypeEnum).includes(value)) throw new Error(`Invalid ConnectorType: ${value}`);
    return new ConnectorType(value);
  }
}

export class ConnectorVersion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ConnectorVersion {
    if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(value)) throw new Error('ConnectorVersion must be semver');
    return new ConnectorVersion(value);
  }
}

export enum ConnectorStatusEnum {
  REGISTERED = 'REGISTERED',
  INSTALLED = 'INSTALLED',
  CONFIGURED = 'CONFIGURED',
  VALIDATED = 'VALIDATED',
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  ERROR = 'ERROR'
}

export class ConnectorStatus extends DomainPrimitive<ConnectorStatusEnum> {
  private constructor(value: ConnectorStatusEnum) { super(value); }
  public static create(value: ConnectorStatusEnum): ConnectorStatus {
    if (!Object.values(ConnectorStatusEnum).includes(value)) throw new Error(`Invalid ConnectorStatus: ${value}`);
    return new ConnectorStatus(value);
  }
}

export enum ConnectorCapabilityEnum {
  AUTHENTICATION = 'AUTHENTICATION',
  CONFIGURATION_VALIDATION = 'CONFIGURATION_VALIDATION',
  HEALTH_CHECKS = 'HEALTH_CHECKS',
  RETRY_POLICIES = 'RETRY_POLICIES',
  RATE_LIMITING = 'RATE_LIMITING',
  PAYLOAD_TRANSFORMATION = 'PAYLOAD_TRANSFORMATION',
  VERSION_COMPATIBILITY = 'VERSION_COMPATIBILITY',
  SANDBOX_MODE = 'SANDBOX_MODE'
}

export class ConnectorCapability extends DomainPrimitive<ConnectorCapabilityEnum> {
  private constructor(value: ConnectorCapabilityEnum) { super(value); }
  public static create(value: ConnectorCapabilityEnum): ConnectorCapability {
    if (!Object.values(ConnectorCapabilityEnum).includes(value)) throw new Error(`Invalid ConnectorCapability: ${value}`);
    return new ConnectorCapability(value);
  }
}

export interface ConnectorCredentialProps {
  clientId: string;
  clientSecretHash: string;
  apiKeyHash?: string;
  oauthToken?: string;
}

export class ConnectorCredential extends DomainPrimitive<ConnectorCredentialProps> {
  private constructor(value: ConnectorCredentialProps) { super(value); }
  public static create(value: ConnectorCredentialProps): ConnectorCredential {
    if (!value.clientId) throw new Error('clientId is required');
    return new ConnectorCredential(value);
  }
}

export class ConnectorEndpoint extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ConnectorEndpoint {
    if (!value || !value.startsWith('https://')) throw new Error('ConnectorEndpoint must be a valid HTTPS URL');
    return new ConnectorEndpoint(value);
  }
}

export interface ConnectorHealthProps {
  isHealthy: boolean;
  latencyMs: number;
  lastCheckedAt: Date;
  errorMessage?: string;
}

export class ConnectorHealth extends DomainPrimitive<ConnectorHealthProps> {
  private constructor(value: ConnectorHealthProps) { super(value); }
  public static create(value: ConnectorHealthProps): ConnectorHealth {
    if (value.latencyMs < 0) throw new Error('latencyMs cannot be negative');
    return new ConnectorHealth(value);
  }
}

export interface ConnectorConfigurationProps {
  settings: Record<string, any>;
  isSandbox: boolean;
}

export class ConnectorConfiguration extends DomainPrimitive<ConnectorConfigurationProps> {
  private constructor(value: ConnectorConfigurationProps) { super(value); }
  public static create(value: ConnectorConfigurationProps): ConnectorConfiguration {
    return new ConnectorConfiguration(value);
  }
}
