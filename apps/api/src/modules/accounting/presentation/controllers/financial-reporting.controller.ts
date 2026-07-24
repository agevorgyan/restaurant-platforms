import { Controller, Get, Query } from '@nestjs/common';
import { BaseReportQueryDto, LedgerReportQueryDto, AgingReportQueryDto } from '../dtos/financial-reporting.dto';

@Controller('reports')
export class FinancialReportingController {

  @Get('balance-sheet')
  async getBalanceSheet(@Query() query: BaseReportQueryDto) {
    return { reportType: 'BALANCE_SHEET', query, message: 'Balance sheet generated.' };
  }

  @Get('income-statement')
  async getIncomeStatement(@Query() query: BaseReportQueryDto) {
    return { reportType: 'INCOME_STATEMENT', query, message: 'Income statement generated.' };
  }

  @Get('cash-flow')
  async getCashFlow(@Query() query: BaseReportQueryDto) {
    return { reportType: 'CASH_FLOW', query, message: 'Cash flow statement generated.' };
  }

  @Get('trial-balance')
  async getTrialBalance(@Query() query: BaseReportQueryDto) {
    return { reportType: 'TRIAL_BALANCE', query, message: 'Trial balance generated.' };
  }

  @Get('general-ledger')
  async getGeneralLedger(@Query() query: BaseReportQueryDto) {
    return { reportType: 'GENERAL_LEDGER', query, message: 'General ledger generated.' };
  }

  @Get('account-ledger')
  async getAccountLedger(@Query() query: LedgerReportQueryDto) {
    return { reportType: 'ACCOUNT_LEDGER', query, message: 'Account ledger generated.' };
  }

  @Get('ar-aging')
  async getArAging(@Query() query: AgingReportQueryDto) {
    return { reportType: 'AR_AGING', query, message: 'Accounts Receivable aging generated.' };
  }

  @Get('ap-aging')
  async getApAging(@Query() query: AgingReportQueryDto) {
    return { reportType: 'AP_AGING', query, message: 'Accounts Payable aging generated.' };
  }
}
