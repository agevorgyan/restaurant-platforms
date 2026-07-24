import { 
  ApiProduct, 
  SdkPackage, 
  ApplicationRegistration,
  ApiUsage,
  SandboxStatistics
} from '../read-models';

export class ApiCatalogService {
  public getCatalog(): ApiProduct[] {
    return [
      {
        productId: 'api-core-v1',
        name: 'Core ERP API',
        description: 'Main REST API for managing restaurant operations, orders, and inventory.',
        version: '1.0.0',
        openApiSpecUrl: 'https://developer.erp.internal/specs/core-v1.yaml',
        isDeprecated: false
      }
    ];
  }
}

export class SdkRegistryService {
  public getAvailableSdks(): SdkPackage[] {
    return [
      {
        language: 'TypeScript',
        version: '1.2.0',
        downloadUrl: 'https://registry.npmjs.org/@saas/node-sdk',
        documentationUrl: 'https://developer.erp.internal/docs/sdks/typescript',
        publishedAt: new Date()
      }
    ];
  }
}

export class CredentialManagementService {
  public async generateApiKey(applicationId: string): Promise<string> {
    const rawKey = `sk_live_${crypto.randomUUID().replace(/-/g, '')}`;
    // Mock storing hash
    console.log(`[CredentialManagementService] Generated API Key for App ${applicationId}`);
    return rawKey;
  }
}

export class SandboxProvisioningService {
  public provisionSandbox(tenantId: string): void {
    console.log(`[SandboxProvisioningService] Provisioning mock sandbox for tenant ${tenantId}`);
  }

  public getStatistics(tenantId: string): SandboxStatistics {
    return {
      tenantId,
      activeMockSessions: 5,
      totalSandboxRequests24h: 12450,
      mockErrorsGenerated24h: 30
    };
  }
}

export class DeveloperAnalyticsService {
  public getUsageMetrics(applicationId: string): ApiUsage {
    return {
      applicationId,
      period: new Date().toISOString().slice(0, 7), // YYYY-MM
      totalRequests: 54000,
      successfulRequests: 53900,
      rateLimitedRequests: 100,
      averageLatencyMs: 45
    };
  }
}

export class DeveloperPortalService {
  private applications: Map<string, ApplicationRegistration> = new Map();

  constructor(private readonly creds: CredentialManagementService) {}

  public async registerApplication(developerId: string, name: string): Promise<ApplicationRegistration> {
    const app: ApplicationRegistration = {
      applicationId: crypto.randomUUID(),
      developerId,
      name,
      description: 'Newly registered app',
      grantedScopes: ['orders:read', 'menu:read'],
      environment: 'ISOLATED',
      createdAt: new Date(),
      status: 'ACTIVE'
    };
    
    this.applications.set(app.applicationId, app);
    return app;
  }

  public getApplications(developerId: string): ApplicationRegistration[] {
    return Array.from(this.applications.values()).filter(a => a.developerId === developerId);
  }
}

export class ApiExplorerService {
  public async executeSandboxRequest(endpoint: string, method: string, payload: any): Promise<any> {
    // Mock interactive API explorer test execution
    console.log(`[ApiExplorerService] Executing mock request to ${method} ${endpoint}`);
    return { status: 200, data: { mockResponse: true } };
  }
}
