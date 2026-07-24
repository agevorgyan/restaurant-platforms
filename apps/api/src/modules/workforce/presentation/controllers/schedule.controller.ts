import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateScheduleDto } from '../dtos';

@Controller('workforce/schedules')
export class ScheduleController {
  @Post()
  async create(@Body() dto: CreateScheduleDto) {
    return { id: crypto.randomUUID(), message: 'Schedule created successfully.' };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return { id, message: 'Schedule retrieved successfully.' };
  }
}
