import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  CreateCampaignEngagementDto,
  RegisterResponseDto,
  RegisterConversionDto,
  RegisterUnsubscribeDto
} from '../dtos/campaign-engagement.dto';

@Controller('campaign-engagements')
export class CampaignEngagementController {
  @Post()
  async createEngagement(@Body() dto: CreateCampaignEngagementDto) {
    return { id: crypto.randomUUID(), message: 'Campaign engagement created.' };
  }

  @Get()
  async getAllEngagements() {
    return { engagements: [], message: 'Campaign engagements retrieved.' };
  }

  @Get(':id')
  async getEngagementById(@Param('id') id: string) {
    return { id, message: 'Campaign engagement retrieved.' };
  }

  @Post(':id/register-response')
  async registerResponse(@Param('id') id: string, @Body() dto: RegisterResponseDto) {
    return { id, message: 'Response registered.' };
  }

  @Post(':id/register-conversion')
  async registerConversion(@Param('id') id: string, @Body() dto: RegisterConversionDto) {
    return { id, message: 'Conversion registered.' };
  }

  @Post(':id/register-unsubscribe')
  async registerUnsubscribe(@Param('id') id: string, @Body() dto: RegisterUnsubscribeDto) {
    return { id, message: 'Unsubscribe registered.' };
  }

  @Post(':id/archive')
  async archiveEngagement(@Param('id') id: string) {
    return { id, message: 'Campaign engagement archived.' };
  }
}
