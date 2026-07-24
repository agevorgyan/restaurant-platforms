import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { 
  CreatePayrollDto, 
  CalculatePayrollDto, 
  ApprovePayrollDto, 
  FinalizePayrollDto, 
  ExportPayrollDto 
} from './../dtos/payroll.dto';

@Controller('payroll')
export class PayrollController {
  @Post()
  async createPayroll(@Body() dto: CreatePayrollDto) {
    return { id: crypto.randomUUID(), message: 'Payroll run created successfully.' };
  }

  @Get()
  async getAll() {
    return { payrolls: [], message: 'Payroll runs retrieved successfully.' };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return { id, message: 'Payroll run retrieved successfully.' };
  }

  @Post(':id/calculate')
  async calculate(@Param('id') id: string, @Body() dto: CalculatePayrollDto) {
    return { id, message: 'Payroll calculated successfully.' };
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Body() dto: ApprovePayrollDto) {
    return { id, message: 'Payroll approved successfully.' };
  }

  @Post(':id/finalize')
  async finalize(@Param('id') id: string, @Body() dto: FinalizePayrollDto) {
    return { id, message: 'Payroll finalized successfully.' };
  }

  @Post(':id/export')
  async export(@Param('id') id: string, @Body() dto: ExportPayrollDto) {
    return { id, message: 'Payroll exported successfully.' };
  }
}
