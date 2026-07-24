import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { CreateChartDto, AddAccountDto, UpdateAccountDto, MoveAccountDto } from '../dtos/chart-of-accounts.dto';

@Controller('charts')
export class ChartOfAccountsController {
  @Post()
  async createChart(@Body() dto: CreateChartDto) {
    return { id: crypto.randomUUID(), message: 'Chart created successfully.' };
  }

  @Get()
  async getAllCharts() {
    return { charts: [], message: 'Charts retrieved successfully.' };
  }

  @Get(':id')
  async getChartById(@Param('id') id: string) {
    return { id, message: 'Chart retrieved successfully.' };
  }

  @Post(':id/activate')
  async activateChart(@Param('id') id: string) {
    return { id, message: 'Chart activated successfully.' };
  }

  @Post(':id/archive')
  async archiveChart(@Param('id') id: string) {
    return { id, message: 'Chart archived successfully.' };
  }

  @Post(':id/accounts')
  async addAccount(@Param('id') id: string, @Body() dto: AddAccountDto) {
    return { id, message: 'Account added successfully.' };
  }

  @Put(':id/accounts/:accountId')
  async updateAccount(@Param('id') id: string, @Param('accountId') accountId: string, @Body() dto: UpdateAccountDto) {
    return { id, accountId, message: 'Account updated successfully.' };
  }

  @Post(':id/accounts/:accountId/deactivate')
  async deactivateAccount(@Param('id') id: string, @Param('accountId') accountId: string) {
    return { id, accountId, message: 'Account deactivated successfully.' };
  }

  @Post(':id/accounts/:accountId/move')
  async moveAccount(@Param('id') id: string, @Param('accountId') accountId: string, @Body() dto: MoveAccountDto) {
    return { id, accountId, message: 'Account moved successfully.' };
  }
}
