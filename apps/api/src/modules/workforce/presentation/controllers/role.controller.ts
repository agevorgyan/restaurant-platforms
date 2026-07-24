import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateRoleDto } from '../dtos';

@Controller('workforce/roles')
export class RoleController {
  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return { id: crypto.randomUUID(), message: 'Role created successfully.' };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return { id, message: 'Role retrieved successfully.' };
  }
}
