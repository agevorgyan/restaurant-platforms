export interface DeveloperProfile {
  developerId: string;
  tenantId: string;
  name: string;
  email: string;
  companyName: string;
  subscriptionTier: 'FREE' | 'PRO' | 'ENTERPRISE';
  joinedAt: Date;
}

export interface ApplicationRegistration {
  applicationId: string;
  developerId: string;
  name: string;
  description: string;
  grantedScopes: string[];
  environment: 'ISOLATED' | 'MOCK' | 'PRE_PRODUCTION' | 'PRODUCTION';
  createdAt: Date;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface ApiProduct {
  productId: string;
  name: string;
  description: string;
  version: string;
  openApiSpecUrl: string;
  asyncApiSpecUrl?: string;
  isDeprecated: boolean;
}

export interface SdkPackage {
  language: string;
  version: string;
  downloadUrl: string;
  documentationUrl: string;
  publishedAt: Date;
}

export interface ApiUsage {
  applicationId: string;
  period: string; // e.g., '2023-10'
  totalRequests: number;
  successfulRequests: number;
  rateLimitedRequests: number;
  averageLatencyMs: number;
}

export interface SandboxStatistics {
  tenantId: string;
  activeMockSessions: number;
  totalSandboxRequests24h: number;
  mockErrorsGenerated24h: number;
}
