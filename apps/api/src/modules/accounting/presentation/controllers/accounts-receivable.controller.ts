import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateReceivableDto, IssueInvoiceDto, AllocatePaymentDto, WriteOffDto, ReopenReceivableDto } from '../dtos/accounts-receivable.dto';

@Controller('receivables')
export class AccountsReceivableController {
  @Post()
  async createReceivable(@Body() dto: CreateReceivableDto) {
    return { id: crypto.randomUUID(), message: 'Receivable created successfully.' };
  }

  @Get()
  async getAllReceivables() {
    return { receivables: [], message: 'Receivables retrieved successfully.' };
  }

  @Get(':id')
  async getReceivableById(@Param('id') id: string) {
    return { id, message: 'Receivable retrieved successfully.' };
  }

  @Post(':id/issue')
  async issueInvoice(@Param('id') id: string, @Body() dto: IssueInvoiceDto) {
    return { id, message: 'Invoice issued successfully.' };
  }

  @Post(':id/allocate-payment')
  async allocatePayment(@Param('id') id: string, @Body() dto: AllocatePaymentDto) {
    return { id, message: 'Payment allocated successfully.' };
  }

  @Post(':id/write-off')
  async writeOff(@Param('id') id: string, @Body() dto: WriteOffDto) {
    return { id, message: 'Receivable written off successfully.' };
  }

  @Post(':id/reopen')
  async reopenReceivable(@Param('id') id: string, @Body() dto: ReopenReceivableDto) {
    return { id, message: 'Receivable reopened successfully.' };
  }
}
