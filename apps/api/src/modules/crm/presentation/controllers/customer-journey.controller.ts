import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  CreateCustomerJourneyDto,
  AdvanceJourneyStageDto,
  AddJourneyMilestoneDto,
  CompleteJourneyMilestoneDto,
  PauseJourneyDto,
  ResumeJourneyDto,
  CloseJourneyDto,
  ArchiveJourneyDto
} from '../dtos/customer-journey.dto';

@Controller('customer-journeys')
export class CustomerJourneyController {
  @Post()
  async createJourney(@Body() dto: CreateCustomerJourneyDto) {
    return { id: crypto.randomUUID(), message: 'Journey created successfully.' };
  }

  @Get()
  async getAllJourneys() {
    return { journeys: [], message: 'Journeys retrieved successfully.' };
  }

  @Get(':id')
  async getJourneyById(@Param('id') id: string) {
    return { id, message: 'Journey retrieved successfully.' };
  }

  @Post(':id/advance-stage')
  async advanceStage(@Param('id') id: string, @Body() dto: AdvanceJourneyStageDto) {
    return { id, message: 'Journey stage advanced successfully.' };
  }

  @Post(':id/add-milestone')
  async addMilestone(@Param('id') id: string, @Body() dto: AddJourneyMilestoneDto) {
    return { id, message: 'Journey milestone added.' };
  }

  @Post(':id/complete-milestone')
  async completeMilestone(@Param('id') id: string, @Body() dto: CompleteJourneyMilestoneDto) {
    return { id, message: 'Journey milestone completed.' };
  }

  @Post(':id/pause')
  async pauseJourney(@Param('id') id: string, @Body() dto: PauseJourneyDto) {
    return { id, message: 'Journey paused.' };
  }

  @Post(':id/resume')
  async resumeJourney(@Param('id') id: string, @Body() dto: ResumeJourneyDto) {
    return { id, message: 'Journey resumed.' };
  }

  @Post(':id/close')
  async closeJourney(@Param('id') id: string, @Body() dto: CloseJourneyDto) {
    return { id, message: 'Journey closed.' };
  }

  @Post(':id/archive')
  async archiveJourney(@Param('id') id: string, @Body() dto: ArchiveJourneyDto) {
    return { id, message: 'Journey archived.' };
  }
}
