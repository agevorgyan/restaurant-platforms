/**
 * Enterprise Webhook Platform - REST Controller
 *
 * Exposes production REST API endpoints for secure webhook ingestion,
 * history queries, operational metrics, Dead Letter Queue (DLQ), and replay execution.
 *
 * API Base Path: /integrations/webhooks
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  WebhookPlatformService,
  DeadLetterService,
} from '../../application/services/webhook-platform.services';
import {
  IngestWebhookDto,
  WebhookResponseDto,
  WebhookQueryDto,
  ReplayWebhookDto,
} from '../../application/dto/webhook.dto';
import {
  WebhookHistory,
  WebhookStatistics,
  DeadLetterQueue,
} from '../../application/read-models/webhook.read-models';

@Controller('integrations/webhooks')
export class EnterpriseWebhookController {
  constructor(
    private readonly webhookService: WebhookPlatformService,
    private readonly dlqService: DeadLetterService
  ) {}

  /**
   * POST /integrations/webhooks/:connector
   * Ingest an inbound webhook from an external integration partner/vendor.
   */
  @Post(':connector')
  @HttpCode(HttpStatus.OK)
  async ingestWebhook(
    @Param('connector') connector: string,
    @Headers() headers: Record<string, string>,
    @Body() payload: unknown
  ): Promise<WebhookResponseDto> {
    const signatureStr =
      headers['x-hub-signature-256'] ||
      headers['x-signature'] ||
      headers['stripe-signature'] ||
      headers['x-webhook-signature'];

    const timestampHeader = headers['x-webhook-timestamp'] || headers['x-timestamp'];
    const nonceHeader = headers['x-webhook-nonce'] || headers['x-nonce'];

    const dto: IngestWebhookDto = {
      connectorId: connector,
      endpointPath: `/integrations/webhooks/${connector}`,
      rawPayload: (payload as object) || {},
      headers,
      signatureStr: Array.isArray(signatureStr) ? signatureStr[0] : signatureStr,
      timestampHeader: Array.isArray(timestampHeader) ? timestampHeader[0] : timestampHeader,
      nonceHeader: Array.isArray(nonceHeader) ? nonceHeader[0] : nonceHeader,
    };

    return this.webhookService.ingestWebhook(dto);
  }

  /**
   * GET /integrations/webhooks
   * Retrieve audit history of ingested webhooks with status and tenant filters.
   */
  @Get()
  async getWebhookHistory(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('connectorId') connectorId?: string,
    @Query('status') status?: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<WebhookHistory> {
    const tenantId = tenantHeader || undefined;
    const query: WebhookQueryDto = {
      tenantId,
      connectorId,
      status,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.webhookService.getHistory(query);
  }

  /**
   * GET /integrations/webhooks/statistics
   * Retrieve operational metrics, total processed, rejected, and DLQ counts.
   */
  @Get('statistics')
  async getStatistics(): Promise<WebhookStatistics> {
    return this.webhookService.getStatistics();
  }

  /**
   * GET /integrations/webhooks/dead-letter
   * Query the Dead Letter Queue for unprocessable or failed webhooks.
   */
  @Get('dead-letter')
  async getDeadLetterQueue(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('connectorId') connectorId?: string
  ): Promise<DeadLetterQueue> {
    const tenantId = tenantHeader || undefined;
    return this.dlqService.getDeadLetterQueue({ tenantId, connectorId });
  }

  /**
   * POST /integrations/webhooks/replay
   * Replay a dead-lettered or failed webhook delivery manually.
   */
  @Post('replay')
  @HttpCode(HttpStatus.OK)
  async replayWebhook(
    @Body() dto: ReplayWebhookDto
  ): Promise<WebhookResponseDto> {
    return this.webhookService.replayDeadLetter(dto.webhookId);
  }
}
