export interface IdentityProviderDefinition {
  providerId: string;
  name: string;
  type: 'GOOGLE' | 'ENTRA_ID' | 'OKTA' | 'AUTH0' | 'KEYCLOAK' | 'APPLE' | 'CUSTOM_OIDC';
  issuerUri: string;
  jwksUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  isActive: boolean;
}

export interface FederatedSession {
  sessionId: string;
  federationId: string;
  tenantId: string;
  providerId: string;
  subject: string;
  grantedScopes: string[];
  issuedAt: Date;
  expiresAt: Date;
  isValid: boolean;
}

export interface FederationHealth {
  providerId: string;
  isAvailable: boolean;
  metadataSyncStatus: 'SYNCED' | 'FAILED' | 'STALE';
  lastSyncAt: Date;
  activeSessions: number;
}

export interface TrustRelationship {
  trustId: string;
  tenantId: string;
  providerId: string;
  allowedDomains: string[];
  requireMfa: boolean;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface TokenExchangeStatistics {
  providerId: string;
  exchanges24h: number;
  failures24h: number;
  averageLatencyMs: number;
}
