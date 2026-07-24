import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { 
  CreateTaxProfileDto, 
  ActivateTaxProfileDto, 
  DeactivateTaxProfileDto, 
  ArchiveTaxProfileDto 
} from './../dtos/tax-profile.dto';

@Controller('tax-profiles')
export class TaxProfileController {
  @Post()
  async createProfile(@Body() dto: CreateTaxProfileDto) {
    return { id: crypto.randomUUID(), message: 'Tax profile created successfully.' };
  }

  @Get()
  async getAll() {
    return { profiles: [], message: 'Tax profiles retrieved successfully.' };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return { id, message: 'Tax profile retrieved successfully.' };
  }

  @Put(':id')
  async updateProfile(@Param('id') id: string, @Body() dto: any) {
    return { id, message: 'Tax profile updated successfully.' };
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string, @Body() dto: ActivateTaxProfileDto) {
    return { id, message: 'Tax profile activated successfully.' };
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string, @Body() dto: DeactivateTaxProfileDto) {
    return { id, message: 'Tax profile deactivated successfully.' };
  }

  @Post(':id/archive')
  async archive(@Param('id') id: string, @Body() dto: ArchiveTaxProfileDto) {
    return { id, message: 'Tax profile archived successfully.' };
  }
}
