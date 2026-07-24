import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { 
  IdentityProviderRegistry,
  FederationService,
  TokenExchangeService,
  FederationHealthService
} from '../../application/services';
import { 
  IdentityProviderDefinition,
  FederationHealth,
  TokenExchangeStatistics
} from '../../application/read-models';

@Controller('identity')
export class EnterpriseIdentityController {
  constructor(
    private readonly registry: IdentityProviderRegistry,
    private readonly federation: FederationService,
    private readonly tokenExchange: TokenExchangeService,
    private readonly healthService: FederationHealthService
  ) {}

  @Get('providers')
  async getProviders(): Promise<IdentityProviderDefinition[]> {
    return this.registry.getAllProviders();
  }

  @Get('providers/:id')
  async getProvider(@Param('id') id: string): Promise<IdentityProviderDefinition | null> {
    const provider = this.registry.getProvider(id);
    return provider || null;
  }

  @Post('providers/register')
  async registerProvider(
    @Body() payload: IdentityProviderDefinition
  ): Promise<{ status: string }> {
    await this.registry.registerProvider(payload);
    return { status: 'REGISTERED' };
  }

  @Post('token/exchange')
  async exchangeToken(
    @Body() payload: { providerToken: string; providerId: string }
  ): Promise<{ internalToken: string }> {
    const internalToken = await this.tokenExchange.exchangeExternalToken(
      payload.providerToken, 
      payload.providerId
    );
    return { internalToken };
  }

  @Get('federation/health')
  async getHealth(@Param('providerId') providerId: string): Promise<FederationHealth> {
    return this.healthService.getHealth(providerId || 'global');
  }

  @Get('statistics')
  async getStatistics(): Promise<TokenExchangeStatistics[]> {
    return this.healthService.getStatistics();
  }
}
