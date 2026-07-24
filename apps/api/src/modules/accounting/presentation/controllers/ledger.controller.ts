import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateLedgerDto, OpenLedgerDto, CloseLedgerDto, ArchiveLedgerDto } from '../dtos/ledger.dto';

@Controller('ledgers')
export class LedgerController {
  @Post()
  async createLedger(@Body() dto: CreateLedgerDto) {
    return { id: crypto.randomUUID(), message: 'Ledger created successfully.' };
  }

  @Get()
  async getAllLedgers() {
    return { ledgers: [], message: 'Ledgers retrieved successfully.' };
  }

  @Get(':id')
  async getLedgerById(@Param('id') id: string) {
    return { id, message: 'Ledger retrieved successfully.' };
  }

  @Post(':id/open')
  async openLedger(@Param('id') id: string, @Body() dto: OpenLedgerDto) {
    return { id, message: 'Ledger opened successfully.' };
  }

  @Post(':id/close')
  async closeLedger(@Param('id') id: string, @Body() dto: CloseLedgerDto) {
    return { id, message: 'Ledger closed successfully.' };
  }

  @Post(':id/archive')
  async archiveLedger(@Param('id') id: string, @Body() dto: ArchiveLedgerDto) {
    return { id, message: 'Ledger archived successfully.' };
  }
}
