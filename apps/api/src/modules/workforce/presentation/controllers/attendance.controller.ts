import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { RecordAttendanceDto } from '../dtos';

@Controller('workforce/attendance')
export class AttendanceController {
  @Post()
  async record(@Body() dto: RecordAttendanceDto) {
    return { id: crypto.randomUUID(), message: 'Attendance recorded successfully.' };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return { id, message: 'Attendance retrieved successfully.' };
  }

  @Put(':id/checkout')
  async checkout(@Param('id') id: string) {
    return { id, message: 'Checkout recorded successfully.' };
  }
}
