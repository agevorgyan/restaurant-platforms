/**
 * Enterprise Integration Catalog - REST Controller
 *
 * Exposes production REST API endpoints for catalog discovery, template registration,
 * certification queries, vendor directories, and catalog metrics.
 *
 * API Base Path: /integrations/catalog
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
import { IntegrationCatalogPlatformService } from '../../application/services/catalog-platform.services';
import {
  CreateCatalogEntryDto,
  UpdateCatalogEntryDto,
  CatalogQueryDto,
  CatalogEntryResponseDto,
} from '../../application/dto/catalog.dto';
import {
  CatalogEntries,
  CertifiedConnectors,
  VendorDirectory,
  ConnectorStatistics,
} from '../../application/read-models/catalog.read-models';

@Controller('integrations/catalog')
export class EnterpriseCatalogController {
  constructor(private readonly catalogService: IntegrationCatalogPlatformService) {}

  /**
   * GET /integrations/catalog
   * Search and filter connector catalog entries.
   */
  @Get()
  async getCatalogEntries(
    @Headers('x-tenant-id') tenantHeader?: string,
    @Query('type') type?: any,
    @Query('certificationLevel') certificationLevel?: any,
    @Query('vendorName') vendorName?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<CatalogEntries> {
    const tenantId = tenantHeader || undefined;
    const query: CatalogQueryDto = {
      tenantId,
      type,
      certificationLevel,
      vendorName,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    };
    return this.catalogService.getCatalogEntries(query);
  }

  /**
   * GET /integrations/catalog/certified
   * Retrieve list of certified connectors.
   */
  @Get('certified')
  async getCertifiedConnectors(): Promise<CertifiedConnectors> {
    return this.catalogService.getCertifiedConnectors();
  }

  /**
   * GET /integrations/catalog/vendors
   * Retrieve vendor directory catalog.
   */
  @Get('vendors')
  async getVendors(): Promise<VendorDirectory> {
    return this.catalogService.getVendorDirectory();
  }

  /**
   * GET /integrations/catalog/statistics
   * Retrieve catalog usage statistics and metrics.
   */
  @Get('statistics')
  async getStatistics(): Promise<ConnectorStatistics> {
    return this.catalogService.getStatistics();
  }

  /**
   * GET /integrations/catalog/:id
   * Retrieve a specific catalog entry by ID.
   */
  @Get(':id')
  async getCatalogEntryById(@Param('id') id: string): Promise<CatalogEntryResponseDto> {
    return this.catalogService.getCatalogEntryById(id);
  }

  /**
   * POST /integrations/catalog
   * Register a new connector template in the integration catalog.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCatalogEntry(
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: CreateCatalogEntryDto
  ): Promise<CatalogEntryResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.catalogService.createCatalogEntry(tenantId, dto);
  }

  /**
   * PATCH /integrations/catalog/:id
   * Update catalog template details.
   * Throws CertifiedTemplateImmutableException if entry is CERTIFIED or ENTERPRISE.
   */
  @Patch(':id')
  async updateCatalogEntry(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantHeader: string,
    @Body() dto: UpdateCatalogEntryDto
  ): Promise<CatalogEntryResponseDto> {
    const tenantId = tenantHeader || 'tenant-default';
    return this.catalogService.updateCatalogEntry(id, tenantId, dto);
  }
}
