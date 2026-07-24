import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { 
  CreatePayrollAdjustmentDto, 
  ModifyPayrollAdjustmentDto, 
  ApprovePayrollAdjustmentDto, 
  RejectPayrollAdjustmentDto, 
  ApplyPayrollAdjustmentDto, 
  CancelPayrollAdjustmentDto 
} from './../dtos/payroll-adjustment.dto';

@Controller('payroll-adjustments')
export class PayrollAdjustmentController {
  @Post()
  async createAdjustment(@Body() dto: CreatePayrollAdjustmentDto) {
    return { id: crypto.randomUUID(), message: 'Payroll adjustment created successfully.' };
  }

  @Get()
  async getAll() {
    return { adjustments: [], message: 'Payroll adjustments retrieved successfully.' };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return { id, message: 'Payroll adjustment retrieved successfully.' };
  }

  @Put(':id')
  async modifyAdjustment(@Param('id') id: string, @Body() dto: ModifyPayrollAdjustmentDto) {
    return { id, message: 'Payroll adjustment modified successfully.' };
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Body() dto: ApprovePayrollAdjustmentDto) {
    return { id, message: 'Payroll adjustment approved successfully.' };
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string, @Body() dto: RejectPayrollAdjustmentDto) {
    return { id, message: 'Payroll adjustment rejected successfully.' };
  }

  @Post(':id/apply')
  async apply(@Param('id') id: string, @Body() dto: ApplyPayrollAdjustmentDto) {
    return { id, message: 'Payroll adjustment applied successfully.' };
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Body() dto: CancelPayrollAdjustmentDto) {
    return { id, message: 'Payroll adjustment cancelled successfully.' };
  }
}
