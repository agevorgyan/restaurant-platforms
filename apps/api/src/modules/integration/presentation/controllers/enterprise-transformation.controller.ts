/**
 * Enterprise Data Transformation Platform - REST Controller
 *
 * Exposes production REST API endpoints for transformation catalog lookup,
 * mapping creation, rule updates, validation, publication, and schema registry management.
 *
 * API Base Paths:
 * - /integrations/transformations
 * - /integrations/schemas
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  TransformationPlatformService,
  TransformationRegistryService,
} from '../../application/services/transformation-platform.services';
import {
  CreateTransformationDto,
  UpdateTransformationDto,
  CreateSchemaDto,
  TransformationResponseDto,
  ExecuteTransformationDto,
} from '../../application/dto/transformation.dto';
import {
  TransformationCatalog,
  SchemaRegistry,
  ValidationResults,
} from '../../application/read-models/transformation.read-models';
import { TransformationResult } from '../../domain/value-objects/transformation-vo';

@Controller('integrations/transformations')
export class EnterpriseTransformationController {
  constructor(
    private readonly transformationService: TransformationPlatformService,
    private readonly registryService: TransformationRegistryService
  ) {}

  /**
   * GET /integrations/transformations
   * Retrieve catalog of transformation definitions.
   */
  @Get()
  async getTransformations(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('type') type?: string,
    @Query('status') status?: string
  ): Promise<TransformationCatalog> {
    const tenantId = tenantHeader || undefined;
    return this.registryService.getCatalog({ tenantId, type, status });
  }

  /**
   * POST /integrations/transformations
   * Create a new transformation mapping definition in DRAFT state.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransformation(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreateTransformationDto
  ): Promise<TransformationResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.transformationService.createTransformation(tenantId, dto);
  }

  /**
   * PATCH /integrations/transformations/:id
   * Update mapping rules for a DRAFT or VALIDATED transformation.
   * Throws ImmutableMappingException if state is PUBLISHED.
   */
  @Patch(':id')
  async updateTransformation(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: UpdateTransformationDto
  ): Promise<TransformationResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.transformationService.updateTransformation(id, tenantId, dto);
  }

  /**
   * POST /integrations/transformations/:id/validate
   * Validate transformation mapping rules against integrity constraints.
   */
  @Post(':id/validate')
  @HttpCode(HttpStatus.OK)
  async validateTransformation(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string
  ): Promise<ValidationResults> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.transformationService.validateTransformation(id, tenantId);
  }

  /**
   * POST /integrations/transformations/:id/publish
   * Publish transformation mapping definition. (Becomes strictly IMMUTABLE).
   */
  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publishTransformation(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string
  ): Promise<TransformationResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.transformationService.publishTransformation(id, tenantId);
  }

  /**
   * POST /integrations/transformations/execute
   * Execute Anti-Corruption Layer transformation mapping on an external payload.
   */
  @Post('execute')
  @HttpCode(HttpStatus.OK)
  async executeTransformation(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: ExecuteTransformationDto
  ): Promise<TransformationResult> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.transformationService.executeTransformation(tenantId, dto);
  }
}

@Controller('integrations/schemas')
export class EnterpriseSchemaController {
  constructor(
    private readonly transformationService: TransformationPlatformService,
    private readonly registryService: TransformationRegistryService
  ) {}

  /**
   * GET /integrations/schemas
   * Retrieve schema registry catalog.
   */
  @Get()
  async getSchemas(
    @Headers('x-tenant-id') tenantHeader?: string
  ): Promise<SchemaRegistry> {
    const tenantId = tenantHeader || undefined;
    return this.registryService.getSchemaRegistry(tenantId);
  }

  /**
   * POST /integrations/schemas
   * Register a new JSON schema definition.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerSchema(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreateSchemaDto
  ): Promise<{ name: string; version: string }> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.transformationService.registerSchema(tenantId, dto);
  }
}
