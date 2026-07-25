/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import {
  SecretService,
  KeyManagementService,
  CertificateService,
  RotationService,
} from '../../application/services';
import {
  CreateSecretDto,
  UpdateSecretDto,
  RotateSecretDto,
  CreateKeyDto,
  CreateCertificateDto,
} from '../../application/dto';

@Controller('security')
export class SecretsController {
  constructor(
    private readonly secretService: SecretService,
    private readonly keyManagementService: KeyManagementService,
    private readonly certificateService: CertificateService,
    private readonly rotationService: RotationService,
  ) {}

  @Get('secrets')
  async getSecrets() {
    return this.secretService.getSecrets();
  }

  @Post('secrets')
  async createSecret(@Body() dto: CreateSecretDto) {
    return this.secretService.createSecret(dto);
  }

  @Patch('secrets/:id')
  async updateSecret(@Param('id') id: string, @Body() dto: UpdateSecretDto) {
    return this.secretService.updateSecret(id, dto);
  }

  @Post('secrets/:id/rotate')
  async rotateSecret(@Param('id') id: string, @Body() dto: RotateSecretDto) {
    return this.rotationService.rotateSecret(id, dto);
  }

  @Get('secrets/expiring')
  async getExpiringSecrets() {
    return this.secretService.getExpiringSecrets();
  }

  @Get('keys')
  async getKeys() {
    return this.keyManagementService.getKeys();
  }

  @Post('keys')
  async createKey(@Body() dto: CreateKeyDto) {
    return this.keyManagementService.createKey(dto);
  }

  @Get('certificates')
  async getCertificates() {
    return this.certificateService.getCertificates();
  }

  @Post('certificates')
  async createCertificate(@Body() dto: CreateCertificateDto) {
    return this.certificateService.createCertificate(dto);
  }
}
