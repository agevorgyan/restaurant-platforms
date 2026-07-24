import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  CreateOpportunityDto,
  AssignOpportunityDto,
  AdvanceOpportunityStageDto,
  MarkOpportunityWonDto,
  MarkOpportunityLostDto,
  ReopenOpportunityDto,
  ArchiveOpportunityDto
} from '../dtos/opportunity.dto';

@Controller('opportunities')
export class OpportunityController {
  @Post()
  async createOpportunity(@Body() dto: CreateOpportunityDto) {
    return { id: crypto.randomUUID(), message: 'Opportunity created successfully.' };
  }

  @Get()
  async getAllOpportunities() {
    return { opportunities: [], message: 'Opportunities retrieved successfully.' };
  }

  @Get(':id')
  async getOpportunityById(@Param('id') id: string) {
    return { id, message: 'Opportunity retrieved successfully.' };
  }

  @Post(':id/assign')
  async assignOpportunity(@Param('id') id: string, @Body() dto: AssignOpportunityDto) {
    return { id, message: 'Opportunity assigned successfully.' };
  }

  @Post(':id/advance-stage')
  async advanceStage(@Param('id') id: string, @Body() dto: AdvanceOpportunityStageDto) {
    return { id, stage: dto.newStage, message: 'Opportunity stage advanced.' };
  }

  @Post(':id/won')
  async markWon(@Param('id') id: string, @Body() dto: MarkOpportunityWonDto) {
    return { id, message: 'Opportunity marked as WON.' };
  }

  @Post(':id/lost')
  async markLost(@Param('id') id: string, @Body() dto: MarkOpportunityLostDto) {
    return { id, message: 'Opportunity marked as LOST.' };
  }

  @Post(':id/reopen')
  async reopenOpportunity(@Param('id') id: string, @Body() dto: ReopenOpportunityDto) {
    return { id, message: 'Opportunity reopened.' };
  }

  @Post(':id/archive')
  async archiveOpportunity(@Param('id') id: string, @Body() dto: ArchiveOpportunityDto) {
    return { id, message: 'Opportunity archived.' };
  }
}
