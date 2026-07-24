import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  CreateInteractionDto,
  AssignInteractionDto,
  AddInteractionNoteDto,
  ScheduleFollowUpDto,
  RecordOutcomeDto,
  CloseInteractionDto,
  ArchiveInteractionDto
} from '../dtos/interaction.dto';

@Controller('interactions')
export class InteractionController {
  @Post()
  async createInteraction(@Body() dto: CreateInteractionDto) {
    return { id: crypto.randomUUID(), message: 'Interaction created successfully.' };
  }

  @Get()
  async getAllInteractions() {
    return { interactions: [], message: 'Interactions retrieved successfully.' };
  }

  @Get(':id')
  async getInteractionById(@Param('id') id: string) {
    return { id, message: 'Interaction retrieved successfully.' };
  }

  @Post(':id/assign')
  async assignInteraction(@Param('id') id: string, @Body() dto: AssignInteractionDto) {
    return { id, message: 'Interaction assigned successfully.' };
  }

  @Post(':id/add-note')
  async addNote(@Param('id') id: string, @Body() dto: AddInteractionNoteDto) {
    return { id, message: 'Interaction note added.' };
  }
  
  @Post(':id/record-outcome')
  async recordOutcome(@Param('id') id: string, @Body() dto: RecordOutcomeDto) {
    return { id, message: 'Interaction outcome recorded.' };
  }

  @Post(':id/schedule-follow-up')
  async scheduleFollowUp(@Param('id') id: string, @Body() dto: ScheduleFollowUpDto) {
    return { id, message: 'Follow up scheduled successfully.' };
  }

  @Post(':id/close')
  async closeInteraction(@Param('id') id: string, @Body() dto: CloseInteractionDto) {
    return { id, message: 'Interaction closed.' };
  }

  @Post(':id/archive')
  async archiveInteraction(@Param('id') id: string, @Body() dto: ArchiveInteractionDto) {
    return { id, message: 'Interaction archived.' };
  }
}
