import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { 
  CreateCompensationPackageDto, 
  UpdateCompensationPackageDto, 
  ActivatePackageDto, 
  DeactivatePackageDto, 
  ArchivePackageDto 
} from './../dtos/compensation-package.dto';

@Controller('compensation-packages')
export class CompensationPackageController {
  @Post()
  async createPackage(@Body() dto: CreateCompensationPackageDto) {
    return { id: crypto.randomUUID(), message: 'Compensation package created successfully.' };
  }

  @Get()
  async getAll() {
    return { packages: [], message: 'Compensation packages retrieved successfully.' };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return { id, message: 'Compensation package retrieved successfully.' };
  }

  @Put(':id')
  async updatePackage(@Param('id') id: string, @Body() dto: UpdateCompensationPackageDto) {
    return { id, message: 'Compensation package updated successfully.' };
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string, @Body() dto: ActivatePackageDto) {
    return { id, message: 'Compensation package activated successfully.' };
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string, @Body() dto: DeactivatePackageDto) {
    return { id, message: 'Compensation package deactivated successfully.' };
  }

  @Post(':id/archive')
  async archive(@Param('id') id: string, @Body() dto: ArchivePackageDto) {
    return { id, message: 'Compensation package archived successfully.' };
  }
}
