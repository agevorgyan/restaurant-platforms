import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { 
  CreatePayrollDocumentDto, 
  GeneratePayrollDocumentDto, 
  ApprovePayrollDocumentDto, 
  FinalizePayrollDocumentDto, 
  ArchivePayrollDocumentDto 
} from './../dtos/payroll-document.dto';

@Controller('payroll-documents')
export class PayrollDocumentController {
  @Post()
  async createDocument(@Body() dto: CreatePayrollDocumentDto) {
    return { id: crypto.randomUUID(), message: 'Payroll document created successfully.' };
  }

  @Get()
  async getAll() {
    return { documents: [], message: 'Payroll documents retrieved successfully.' };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return { id, message: 'Payroll document retrieved successfully.' };
  }

  @Post(':id/generate')
  async generate(@Param('id') id: string, @Body() dto: GeneratePayrollDocumentDto) {
    return { id, message: 'Payroll document generated successfully.' };
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Body() dto: ApprovePayrollDocumentDto) {
    return { id, message: 'Payroll document approved successfully.' };
  }

  @Post(':id/finalize')
  async finalize(@Param('id') id: string, @Body() dto: FinalizePayrollDocumentDto) {
    return { id, message: 'Payroll document finalized successfully.' };
  }

  @Post(':id/archive')
  async archive(@Param('id') id: string, @Body() dto: ArchivePayrollDocumentDto) {
    return { id, message: 'Payroll document archived successfully.' };
  }

  @Post(':id/export/:format')
  async export(@Param('id') id: string, @Param('format') format: string) {
    // Delegates implicitly to ExportService inside Application Layer
    return { id, format, message: `Payroll document exported successfully to ${format}.` };
  }
}
