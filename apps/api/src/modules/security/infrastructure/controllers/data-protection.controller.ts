/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  DataProtectionService,
  DataClassificationService,
  MaskingService,
  TokenizationService,
  PrivacyService,
} from '../../application/services';
import {
  ClassifyDataDto,
  ApplyMaskingDto,
  TokenizeFieldDto,
  SubmitPrivacyRequestDto,
} from '../../application/dto';

@Controller('security')
export class DataProtectionController {
  constructor(
    private readonly dataProtectionService: DataProtectionService,
    private readonly classificationService: DataClassificationService,
    private readonly maskingService: MaskingService,
    private readonly tokenizationService: TokenizationService,
    private readonly privacyService: PrivacyService,
  ) {}

  /** GET /security/data-protection — Returns current protection status overview. */
  @Get('data-protection')
  async getProtectionStatus() {
    return this.dataProtectionService.getProtectionStatus();
  }

  /** GET /security/data-protection/statistics — Returns aggregate protection metrics. */
  @Get('data-protection/statistics')
  async getStatistics() {
    return this.dataProtectionService.getStatistics();
  }

  /** GET /security/classification — Returns all data classifications. */
  @Get('classification')
  async getClassifications() {
    return this.classificationService.getClassifications();
  }

  /** POST /security/classification — Classifies a data resource. */
  @Post('classification')
  async classifyData(@Body() dto: ClassifyDataDto) {
    return this.classificationService.classify(dto);
  }

  /** POST /security/masking — Applies dynamic masking to a field. */
  @Post('masking')
  async applyMasking(@Body() dto: ApplyMaskingDto) {
    return this.maskingService.applyMasking(dto);
  }

  /** POST /security/tokenization — Tokenizes a sensitive field value. */
  @Post('tokenization')
  async tokenize(@Body() dto: TokenizeFieldDto) {
    return this.tokenizationService.tokenize(dto);
  }

  /** POST /security/privacy/request — Submits a privacy request. */
  @Post('privacy/request')
  async submitPrivacyRequest(@Body() dto: SubmitPrivacyRequestDto) {
    return this.privacyService.submitRequest(dto);
  }

  /** GET /security/privacy/requests — Returns all privacy requests. */
  @Get('privacy/requests')
  async getPrivacyRequests() {
    return this.privacyService.getRequests();
  }
}
