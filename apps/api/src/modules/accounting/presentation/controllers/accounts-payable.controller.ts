import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import {
  CreatePayableDto,
  RegisterInvoiceDto,
  ApprovePayableDto,
  AllocatePaymentDto,
  ApplyCreditNoteDto,
  WriteOffDto,
  ReopenPayableDto
} from '../dtos/accounts-payable.dto';

@Controller('payables')
export class AccountsPayableController {
  @Post()
  async createPayable(@Body() dto: CreatePayableDto) {
    return { id: crypto.randomUUID(), message: 'Payable created successfully.' };
  }

  @Get()
  async getAllPayables() {
    return { payables: [], message: 'Payables retrieved successfully.' };
  }

  @Get(':id')
  async getPayableById(@Param('id') id: string) {
    return { id, message: 'Payable retrieved successfully.' };
  }

  @Post(':id/register-invoice')
  async registerInvoice(@Param('id') id: string, @Body() dto: RegisterInvoiceDto) {
    return { id, message: 'Supplier invoice registered successfully.' };
  }

  @Post(':id/approve')
  async approvePayable(@Param('id') id: string, @Body() dto: ApprovePayableDto) {
    return { id, message: 'Payable approved successfully.' };
  }

  @Post(':id/allocate-payment')
  async allocatePayment(@Param('id') id: string, @Body() dto: AllocatePaymentDto) {
    return { id, message: 'Payment allocated successfully.' };
  }

  @Post(':id/apply-credit-note')
  async applyCreditNote(@Param('id') id: string, @Body() dto: ApplyCreditNoteDto) {
    return { id, message: 'Credit note applied successfully.' };
  }

  @Post(':id/write-off')
  async writeOff(@Param('id') id: string, @Body() dto: WriteOffDto) {
    return { id, message: 'Payable written off successfully.' };
  }

  @Post(':id/reopen')
  async reopenPayable(@Param('id') id: string, @Body() dto: ReopenPayableDto) {
    return { id, message: 'Payable reopened successfully.' };
  }
}
