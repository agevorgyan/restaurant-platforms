/**
 * Enterprise Integration Event Bridge - REST Controller
 *
 * Exposes production REST API endpoints for dashboard summary,
 * event replay execution, translation history, bridge metrics, and Dead Letter Queue.
 *
 * API Base Path: /integrations/bridge
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
  IntegrationBridgePlatformService,
  DeadLetterService,
} from '../../application/services/bridge-platform.services';
import {
  IngestExternalEventDto,
  ReplayBridgeEventDto,
  BridgeQueryDto,
  BridgeEventResponseDto,
} from '../../application/dto/bridge.dto';
import {
  BridgeDashboard,
  TranslationHistory,
  DeadLetterQueue,
  BridgeStatistics,
} from '../../application/read-models/bridge.read-models';

@Controller('integrations/bridge')
export class EnterpriseBridgeController {
  constructor(
    private readonly bridgeService: IntegrationBridgePlatformService,
    private readonly dlqService: DeadLetterService
  ) {}

  /**
   * GET /integrations/bridge
   * Retrieve high-level dashboard and metrics summary.
   */
  @Get()
  async getDashboard(): Promise<BridgeDashboard> {
    return this.bridgeService.getDashboard();
  }

  /**
   * POST /integrations/bridge/ingest
   * Ingest an external event from a partner system (REST, Webhook, Queue, Polling).
   */
  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  async ingestExternalEvent(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: IngestExternalEventDto
  ): Promise<BridgeEventResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.bridgeService.ingestExternalEvent(tenantId, dto);
  }

  /**
   * POST /integrations/bridge/replay
   * Replay an external or translated event without duplicating side effects.
   */
  @Post('replay')
  @HttpCode(HttpStatus.OK)
  async replayEvent(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ReplayBridgeEventDto
  ): Promise<BridgeEventResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.bridgeService.replayEvent(dto, tenantId);
  }

  /**
   * GET /integrations/bridge/history
   * Retrieve history log of translated events.
   */
  @Get('history')
  async getHistory(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('connectorId') connectorId?: string,
    @Query('status') status?: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<TranslationHistory> {
    const tenantId = tenantHeader || undefined;
    const query: BridgeQueryDto = {
      tenantId,
      connectorId,
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.bridgeService.getHistory(query);
  }

  /**
   * GET /integrations/bridge/statistics
   * Retrieve operational metrics and translation statistics.
   */
  @Get('statistics')
  async getStatistics(): Promise<BridgeStatistics> {
    return this.bridgeService.getStatistics();
  }

  /**
   * GET /integrations/bridge/dead-letter
   * Query the Dead Letter Queue for failed bridge event translations.
   */
  @Get('dead-letter')
  async getDeadLetterQueue(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('connectorId') connectorId?: string
  ): Promise<DeadLetterQueue> {
    const tenantId = tenantHeader || undefined;
    return this.dlqService.getDeadLetterQueue({ tenantId, connectorId });
  }
}
