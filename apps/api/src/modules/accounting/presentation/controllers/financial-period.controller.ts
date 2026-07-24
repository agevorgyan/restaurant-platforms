import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  CreateFinancialPeriodDto,
  OpenPeriodDto,
  ClosePeriodDto,
  LockPeriodDto,
  ReopenPeriodDto,
  ArchivePeriodDto
} from '../dtos/financial-period.dto';

@Controller('financial-periods')
export class FinancialPeriodController {
  @Post()
  async createPeriod(@Body() dto: CreateFinancialPeriodDto) {
    return { id: crypto.randomUUID(), message: 'Financial period created successfully.' };
  }

  @Get()
  async getAllPeriods() {
    return { periods: [], message: 'Financial periods retrieved successfully.' };
  }

  @Get(':id')
  async getPeriodById(@Param('id') id: string) {
    return { id, message: 'Financial period retrieved successfully.' };
  }

  @Post(':id/open')
  async openPeriod(@Param('id') id: string, @Body() dto: OpenPeriodDto) {
    return { id, message: 'Financial period opened successfully.' };
  }

  @Post(':id/close')
  async closePeriod(@Param('id') id: string, @Body() dto: ClosePeriodDto) {
    return { id, message: 'Financial period closed successfully.' };
  }

  @Post(':id/lock')
  async lockPeriod(@Param('id') id: string, @Body() dto: LockPeriodDto) {
    return { id, message: 'Financial period locked successfully.' };
  }

  @Post(':id/reopen')
  async reopenPeriod(@Param('id') id: string, @Body() dto: ReopenPeriodDto) {
    return { id, message: 'Financial period reopened successfully.' };
  }

  @Post(':id/archive')
  async archivePeriod(@Param('id') id: string, @Body() dto: ArchivePeriodDto) {
    return { id, message: 'Financial period archived successfully.' };
  }
}
