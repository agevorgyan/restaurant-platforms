import { Identifier, DomainPrimitive } from '@saas/domain';

export class IdentityProviderId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): IdentityProviderId { return new IdentityProviderId(value); }
  public static generate(): IdentityProviderId { return new IdentityProviderId(crypto.randomUUID()); }
}

export enum IdentityProviderTypeEnum {
  GOOGLE = 'GOOGLE',
  ENTRA_ID = 'ENTRA_ID',
  OKTA = 'OKTA',
  AUTH0 = 'AUTH0',
  KEYCLOAK = 'KEYCLOAK',
  APPLE = 'APPLE',
  CUSTOM_OIDC = 'CUSTOM_OIDC'
}

export class IdentityProviderType extends DomainPrimitive<IdentityProviderTypeEnum> {
  private constructor(value: IdentityProviderTypeEnum) { super(value); }
  public static create(value: IdentityProviderTypeEnum): IdentityProviderType {
    if (!Object.values(IdentityProviderTypeEnum).includes(value)) throw new Error(`Invalid IdentityProviderType: ${value}`);
    return new IdentityProviderType(value);
  }
}

export class FederationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): FederationId { return new FederationId(value); }
  public static generate(): FederationId { return new FederationId(crypto.randomUUID()); }
}

export class FederatedSubject extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): FederatedSubject {
    if (!value || value.trim() === '') throw new Error('FederatedSubject cannot be empty');
    return new FederatedSubject(value);
  }
}

export class ClientId extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ClientId {
    if (!value || value.trim() === '') throw new Error('ClientId cannot be empty');
    return new ClientId(value);
  }
}

export class ClientSecretReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ClientSecretReference {
    if (!value || value.trim() === '') throw new Error('ClientSecretReference cannot be empty');
    return new ClientSecretReference(value);
  }
}

export class TokenLifetime extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): TokenLifetime {
    if (value < 60) throw new Error('TokenLifetime must be at least 60 seconds');
    return new TokenLifetime(value);
  }
}

export interface RefreshPolicyProps {
  allowRefresh: boolean;
  absoluteLifetimeSeconds?: number;
  idleLifetimeSeconds?: number;
}

export class RefreshPolicy extends DomainPrimitive<RefreshPolicyProps> {
  private constructor(value: RefreshPolicyProps) { super(value); }
  public static create(value: RefreshPolicyProps): RefreshPolicy {
    return new RefreshPolicy(value);
  }
}

export interface TrustPolicyProps {
  requireSignedRequests: boolean;
  requireEncryptedTokens: boolean;
  allowedIssuers: string[];
}

export class TrustPolicy extends DomainPrimitive<TrustPolicyProps> {
  private constructor(value: TrustPolicyProps) { super(value); }
  public static create(value: TrustPolicyProps): TrustPolicy {
    return new TrustPolicy(value);
  }
}
