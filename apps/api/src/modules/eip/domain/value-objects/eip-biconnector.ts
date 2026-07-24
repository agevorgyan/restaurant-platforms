import { Identifier, DomainPrimitive } from '@saas/domain';

export class ConnectorId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ConnectorId { return new ConnectorId(value); }
  public static generate(): ConnectorId { return new ConnectorId(crypto.randomUUID()); }
}

export enum ConnectorTypeEnum {
  POWER_BI = 'POWER_BI',
  TABLEAU = 'TABLEAU',
  LOOKER = 'LOOKER',
  GRAFANA = 'GRAFANA',
  METABASE = 'METABASE',
  SUPERSET = 'SUPERSET',
  REST_API = 'REST_API',
  GRAPHQL = 'GRAPHQL',
  SQL_GATEWAY = 'SQL_GATEWAY'
}

export class ConnectorType extends DomainPrimitive<ConnectorTypeEnum> {
  private constructor(value: ConnectorTypeEnum) { super(value); }
  public static create(value: ConnectorTypeEnum): ConnectorType {
    if (!Object.values(ConnectorTypeEnum).includes(value)) throw new Error(`Invalid ConnectorType: ${value}`);
    return new ConnectorType(value);
  }
}

export enum ConnectorStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  DEGRADED = 'DEGRADED',
  FAILED = 'FAILED'
}

export class ConnectorStatus extends DomainPrimitive<ConnectorStatusEnum> {
  private constructor(value: ConnectorStatusEnum) { super(value); }
  public static create(value: ConnectorStatusEnum): ConnectorStatus {
    if (!Object.values(ConnectorStatusEnum).includes(value)) throw new Error(`Invalid ConnectorStatus: ${value}`);
    return new ConnectorStatus(value);
  }
}

export class DatasetReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DatasetReference {
    if (!value || value.trim() === '') throw new Error('DatasetReference cannot be empty');
    return new DatasetReference(value);
  }
}

export class SchemaVersion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SchemaVersion {
    if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(value)) throw new Error('SchemaVersion must follow semantic versioning (x.y.z)');
    return new SchemaVersion(value);
  }
}

export enum AccessPolicyEnum {
  READ_ONLY = 'READ_ONLY',
  TENANT_ISOLATED = 'TENANT_ISOLATED',
  PUBLIC = 'PUBLIC'
}

export class AccessPolicy extends DomainPrimitive<AccessPolicyEnum> {
  private constructor(value: AccessPolicyEnum) { super(value); }
  public static create(value: AccessPolicyEnum): AccessPolicy {
    if (!Object.values(AccessPolicyEnum).includes(value)) throw new Error(`Invalid AccessPolicy: ${value}`);
    return new AccessPolicy(value);
  }
}

export class RefreshToken extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RefreshToken {
    if (!value || value.trim() === '') throw new Error('RefreshToken cannot be empty');
    return new RefreshToken(value);
  }
}
