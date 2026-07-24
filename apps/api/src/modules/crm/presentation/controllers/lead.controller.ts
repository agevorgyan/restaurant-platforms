import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  CreateLeadDto,
  QualifyLeadDto,
  DisqualifyLeadDto,
  AssignLeadDto,
  ConvertLeadDto,
  ArchiveLeadDto
} from '../dtos/lead.dto';

@Controller('leads')
export class LeadController {
  @Post()
  async createLead(@Body() dto: CreateLeadDto) {
    return { id: crypto.randomUUID(), message: 'Lead created successfully.' };
  }

  @Get()
  async getAllLeads() {
    return { leads: [], message: 'Leads retrieved successfully.' };
  }

  @Get(':id')
  async getLeadById(@Param('id') id: string) {
    return { id, message: 'Lead retrieved successfully.' };
  }

  @Post(':id/qualify')
  async qualifyLead(@Param('id') id: string, @Body() dto: QualifyLeadDto) {
    return { id, message: 'Lead qualified successfully.' };
  }

  @Post(':id/disqualify')
  async disqualifyLead(@Param('id') id: string, @Body() dto: DisqualifyLeadDto) {
    return { id, message: 'Lead disqualified.' };
  }

  @Post(':id/assign')
  async assignLead(@Param('id') id: string, @Body() dto: AssignLeadDto) {
    return { id, message: 'Lead assigned successfully.' };
  }

  @Post(':id/convert')
  async convertLead(@Param('id') id: string, @Body() dto: ConvertLeadDto) {
    return { id, targetId: crypto.randomUUID(), message: 'Lead converted successfully.' };
  }

  @Post(':id/archive')
  async archiveLead(@Param('id') id: string, @Body() dto: ArchiveLeadDto) {
    return { id, message: 'Lead archived successfully.' };
  }
}
