/**
 * Enterprise HTTP & API Integration Platform - REST Controller
 *
 * Exposes production REST API endpoints for outbound request tracking,
 * latency statistics, circuit breaker dashboards, test executions, and rate limit status.
 *
 * API Base Path: /integrations/http
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  HttpIntegrationService,
  CircuitBreakerService,
} from '../../application/services/http-platform.services';
import {
  ExecuteHttpRequestDto,
  OutboundResponseDto,
  TestOutboundRequestDto,
  HttpQueryDto,
} from '../../application/dto/http.dto';
import {
  RequestHistory,
  CircuitBreakerDashboard,
  RateLimitDashboard,
  ApiLatencyStatistics,
  FailureStatistics,
} from '../../application/read-models/http.read-models';
import { HttpMethodEnum } from '../../domain/enums/http.enums';

@Controller('integrations/http')
export class EnterpriseHttpController {
  constructor(
    private readonly httpIntegrationService: HttpIntegrationService,
    private readonly circuitBreakerService: CircuitBreakerService
  ) {}

  /**
   * GET /integrations/http/requests
   * Query history of outbound requests with filtering.
   */
  @Get('requests')
  async getRequestHistory(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('connectorId') connectorId?: string,
    @Query('status') status?: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<RequestHistory> {
    const tenantId = tenantHeader || undefined;
    const query: HttpQueryDto = {
      tenantId,
      connectorId,
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.httpIntegrationService.getHistory(query);
  }

  /**
   * GET /integrations/http/statistics
   * Retrieve outbound API latency percentiles (P50/P95/P99) and failure statistics.
   */
  @Get('statistics')
  async getStatistics(
    @Query('connectorId') connectorId?: string
  ): Promise<{
    latency: ApiLatencyStatistics;
    failures: FailureStatistics;
  }> {
    const latency = await this.httpIntegrationService.getLatencyStatistics(connectorId);
    const failures = await this.httpIntegrationService.getFailureStatistics();
    return { latency, failures };
  }

  /**
   * GET /integrations/http/circuits
   * Retrieve circuit breaker status dashboard across all connectors.
   */
  @Get('circuits')
  async getCircuitBreakerDashboard(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<CircuitBreakerDashboard> {
    const tenantId = tenantHeader || undefined;
    return this.circuitBreakerService.getDashboard(tenantId);
  }

  /**
   * GET /integrations/http/rate-limits
   * Query sliding window rate limit usage and capacity per connector.
   */
  @Get('rate-limits')
  async getRateLimitDashboard(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<RateLimitDashboard> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.httpIntegrationService.getRateLimitDashboard(tenantId);
  }

  /**
   * POST /integrations/http/test
   * Execute an outbound test request with full resilience policies (retry, circuit breaker, rate limit).
   */
  @Post('test')
  @HttpCode(HttpStatus.OK)
  async executeTestRequest(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: TestOutboundRequestDto
  ): Promise<OutboundResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    const executeDto: ExecuteHttpRequestDto = {
      connectorId: dto.connectorId,
      endpointUrl: dto.endpointUrl,
      method: dto.method || HttpMethodEnum.GET,
      headers: dto.headers,
      body: dto.body,
    };
    return this.httpIntegrationService.executeRequest(tenantId, executeDto);
  }
}
