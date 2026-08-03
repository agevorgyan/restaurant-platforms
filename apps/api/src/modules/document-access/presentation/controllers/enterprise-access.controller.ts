import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SecureAccessService, PermissionValidationService } from '../../domain/services';
import { 
  RequesterIdentity, 
  ObjectReference,
  AccessTypeEnum
} from '../../domain/value-objects';
import { AccessAuditRecord, AccessStatistics } from '../../application/read-models';

@Controller('documents/access')
export class EnterpriseAccessController {
  constructor(
    private readonly accessService: SecureAccessService,
    private readonly validator: PermissionValidationService
  ) {}

  @Post('upload-url')
  async generateUploadUrl(@Body() payload: any): Promise<{ url: string }> {
    const identity = RequesterIdentity.create(payload.identity).toValue();
    const objectRef = ObjectReference.create(payload.objectReference).toValue();
    
    const url = await this.accessService.requestUploadUrl(identity, objectRef);
    return { url };
  }

  @Post('download-url')
  async generateDownloadUrl(@Body() payload: any): Promise<{ url: string }> {
    const identity = RequesterIdentity.create(payload.identity).toValue();
    const objectRef = ObjectReference.create(payload.objectReference).toValue();
    
    const url = await this.accessService.requestDownloadUrl(identity, objectRef);
    return { url };
  }

  @Post('validate')
  async validateAccess(@Body() payload: any): Promise<{ valid: boolean }> {
    const identity = RequesterIdentity.create(payload.identity).toValue();
    const objectRef = ObjectReference.create(payload.objectReference).toValue();
    
    try {
      await this.validator.validateAccess(identity, objectRef, payload.accessType as AccessTypeEnum);
      return { valid: true };
    } catch (e) {
      return { valid: false };
    }
  }

  @Get('audit')
  async getAuditLogs(
    @Query('tenantId') tenantId: string,
    @Query('documentId') documentId?: string
  ): Promise<AccessAuditRecord[]> {
    if (!tenantId) throw new Error('tenantId is required');
    // Return mock audit records
    return [];
  }

  @Get('statistics')
  async getStatistics(@Query('tenantId') tenantId: string): Promise<AccessStatistics> {
    if (!tenantId) throw new Error('tenantId is required');
    
    return {
      tenantId,
      totalUploads: 1500,
      totalDownloads: 45000,
      deniedRequests: 12,
      period: new Date().toISOString().slice(0, 7)
    };
  }
}
