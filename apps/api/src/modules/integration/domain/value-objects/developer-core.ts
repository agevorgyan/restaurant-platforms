import { Identifier, DomainPrimitive } from '@saas/domain';

export class DeveloperId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DeveloperId { return new DeveloperId(value); }
  public static generate(): DeveloperId { return new DeveloperId(crypto.randomUUID()); }
}

export class ApplicationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ApplicationId { return new ApplicationId(value); }
  public static generate(): ApplicationId { return new ApplicationId(crypto.randomUUID()); }
}

export class ApiProductId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ApiProductId { return new ApiProductId(value); }
  public static generate(): ApiProductId { return new ApiProductId(crypto.randomUUID()); }
}

export class ApiVersion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ApiVersion {
    if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(value)) throw new Error('ApiVersion must be semver');
    return new ApiVersion(value);
  }
}

export class SdkVersion extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SdkVersion {
    if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(value)) throw new Error('SdkVersion must be semver');
    return new SdkVersion(value);
  }
}

export enum SandboxEnvironmentEnum {
  ISOLATED = 'ISOLATED',
  MOCK = 'MOCK',
  PRE_PRODUCTION = 'PRE_PRODUCTION'
}

export class SandboxEnvironment extends DomainPrimitive<SandboxEnvironmentEnum> {
  private constructor(value: SandboxEnvironmentEnum) { super(value); }
  public static create(value: SandboxEnvironmentEnum): SandboxEnvironment {
    if (!Object.values(SandboxEnvironmentEnum).includes(value)) throw new Error(`Invalid SandboxEnvironment: ${value}`);
    return new SandboxEnvironment(value);
  }
}

export interface ApiCredentialProps {
  clientId: string;
  clientSecretHash: string;
  apiKeyHash?: string;
  scopes: string[];
}

export class ApiCredential extends DomainPrimitive<ApiCredentialProps> {
  private constructor(value: ApiCredentialProps) { super(value); }
  public static create(value: ApiCredentialProps): ApiCredential {
    if (!value.clientId) throw new Error('clientId is required');
    return new ApiCredential(value);
  }
}

export interface DeveloperSubscriptionProps {
  tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  rateLimitPerMinute: number;
  monthlyQuota: number;
}

export class DeveloperSubscription extends DomainPrimitive<DeveloperSubscriptionProps> {
  private constructor(value: DeveloperSubscriptionProps) { super(value); }
  public static create(value: DeveloperSubscriptionProps): DeveloperSubscription {
    if (value.rateLimitPerMinute <= 0) throw new Error('rateLimitPerMinute must be positive');
    return new DeveloperSubscription(value);
  }
}
