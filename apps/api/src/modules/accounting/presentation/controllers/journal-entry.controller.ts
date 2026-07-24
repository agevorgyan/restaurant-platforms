import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { 
  CreateJournalEntryDto, 
  ApproveJournalEntryDto, 
  PostJournalEntryDto, 
  ReverseJournalEntryDto, 
  VoidJournalEntryDto 
} from '../dtos/journal-entry.dto';

@Controller('journal-entries')
export class JournalEntryController {
  @Post()
  async createJournal(@Body() dto: CreateJournalEntryDto) {
    return { id: crypto.randomUUID(), message: 'Journal entry created successfully.' };
  }

  @Get()
  async getAllJournals() {
    return { journals: [], message: 'Journal entries retrieved successfully.' };
  }

  @Get(':id')
  async getJournalById(@Param('id') id: string) {
    return { id, message: 'Journal entry retrieved successfully.' };
  }

  @Post(':id/approve')
  async approveJournal(@Param('id') id: string, @Body() dto: ApproveJournalEntryDto) {
    return { id, message: 'Journal entry approved successfully.' };
  }

  @Post(':id/post')
  async postJournal(@Param('id') id: string, @Body() dto: PostJournalEntryDto) {
    return { id, message: 'Journal entry posted successfully.' };
  }

  @Post(':id/reverse')
  async reverseJournal(@Param('id') id: string, @Body() dto: ReverseJournalEntryDto) {
    return { id, message: 'Journal entry reversed successfully.' };
  }

  @Post(':id/void')
  async voidJournal(@Param('id') id: string, @Body() dto: VoidJournalEntryDto) {
    return { id, message: 'Journal entry voided successfully.' };
  }
}
