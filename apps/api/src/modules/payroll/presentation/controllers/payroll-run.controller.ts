import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { 
  CreatePayrollRunDto, 
  CalculatePayrollRunDto, 
  ApprovePayrollRunDto, 
  RejectPayrollRunDto,
  FinalizePayrollRunDto, 
  ReopenPayrollRunDto
} from './../dtos/payroll-run.dto';

@Controller('payroll-runs')
export class PayrollRunController {
  @Post()
  async createPayroll(@Body() dto: CreatePayrollRunDto) {
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
  async calculate(@Param('id') id: string, @Body() dto: CalculatePayrollRunDto) {
    return { id, message: 'Payroll calculated successfully.' };
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Body() dto: ApprovePayrollRunDto) {
    return { id, message: 'Payroll approved successfully.' };
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() dto: RejectPayrollRunDto) {
    return { id, message: 'Payroll rejected successfully.' };
  }

  @Post(':id/finalize')
  async finalize(@Param('id') id: string, @Body() dto: FinalizePayrollRunDto) {
    return { id, message: 'Payroll finalized successfully.' };
  }

  @Post(':id/reopen')
  async reopen(@Param('id') id: string, @Body() dto: ReopenPayrollRunDto) {
    return { id, message: 'Payroll reopened successfully.' };
  }
}
