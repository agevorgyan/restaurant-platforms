import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  ApiCatalogService,
  SdkRegistryService,
  DeveloperPortalService,
  CredentialManagementService,
  DeveloperAnalyticsService,
  SandboxProvisioningService
} from '../../application/services';
import { 
  ApiProduct,
  SdkPackage,
  ApplicationRegistration,
  ApiUsage,
  SandboxStatistics
} from '../../application/read-models';

@Controller('developer')
export class EnterpriseDeveloperController {
  constructor(
    private readonly apiCatalog: ApiCatalogService,
    private readonly sdkRegistry: SdkRegistryService,
    private readonly portal: DeveloperPortalService,
    private readonly creds: CredentialManagementService,
    private readonly analytics: DeveloperAnalyticsService,
    private readonly sandbox: SandboxProvisioningService
  ) {}

  @Get('apis')
  async getApis(): Promise<ApiProduct[]> {
    return this.apiCatalog.getCatalog();
  }

  @Get('events')
  async getEvents(): Promise<any[]> {
    return [
      { eventName: 'OrderCreated', version: '1.0', schemaUrl: '/schemas/OrderCreated.json' }
    ];
  }

  @Get('webhooks')
  async getWebhooks(): Promise<any[]> {
    return [
      { name: 'order.status.changed', description: 'Fired when an order changes status' }
    ];
  }

  @Get('sdks')
  async getSdks(): Promise<SdkPackage[]> {
    return this.sdkRegistry.getAvailableSdks();
  }

  @Get('apps')
  async getApps(@Param('developerId') developerId: string): Promise<ApplicationRegistration[]> {
    return this.portal.getApplications(developerId || 'mock-dev-id');
  }

  @Post('apps')
  async registerApp(
    @Body() payload: { developerId: string; name: string }
  ): Promise<ApplicationRegistration> {
    return this.portal.registerApplication(payload.developerId, payload.name);
  }

  @Post('apikeys')
  async generateApiKey(
    @Body() payload: { applicationId: string }
  ): Promise<{ apiKey: string }> {
    const apiKey = await this.creds.generateApiKey(payload.applicationId);
    return { apiKey };
  }

  @Get('statistics')
  async getStatistics(@Param('tenantId') tenantId: string): Promise<SandboxStatistics> {
    return this.sandbox.getStatistics(tenantId || 'global');
  }
}
