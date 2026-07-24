import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CreateStaffDto, UpdateStaffDto } from '../dtos';

@Controller('workforce/staff')
export class StaffController {
  @Post()
  async create(@Body() dto: CreateStaffDto) {
    return { id: crypto.randomUUID(), message: 'Staff member created successfully.' };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return { id, message: 'Staff member retrieved successfully.' };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return { id, message: 'Staff member updated successfully.' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return { id, message: 'Staff member deactivated successfully.' };
  }
}
