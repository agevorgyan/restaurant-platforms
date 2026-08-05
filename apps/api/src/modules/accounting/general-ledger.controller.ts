import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { GeneralLedgerService } from './general-ledger.service';
import { CreateAccountDto, ReparentAccountDto, UpdatePostingRuleDto } from './dto/general-ledger.dto';

@ApiTags('General Ledger & Chart of Accounts')
@Controller('accounting/general-ledger')
export class GeneralLedgerController {
  constructor(private readonly glService: GeneralLedgerService) {}

  @Post('accounts')
  @ApiOperation({ summary: 'Create a new GL Account in Chart of Accounts' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  public createAccount(@Headers('x-tenant-id') tenantHeader: string, @Body() dto: CreateAccountDto) {
    const tenantId = tenantHeader || 'default-tenant';
    return this.glService.createAccount(tenantId, dto);
  }

  @Put('accounts/:id/reparent')
  @ApiOperation({ summary: 'Reparent GL Account within hierarchy tree' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  public reparentAccount(
    @Headers('x-tenant-id') tenantHeader: string,
    @Param('id') accountId: string,
    @Body() dto: ReparentAccountDto
  ) {
    const tenantId = tenantHeader || 'default-tenant';
    return this.glService.reparentAccount(tenantId, accountId, dto);
  }

  @Put('accounts/code/:code/posting-rules')
  @ApiOperation({ summary: 'Update Posting Rules for a GL Account' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  public updatePostingRule(
    @Headers('x-tenant-id') tenantHeader: string,
    @Param('code') code: string,
    @Body() dto: UpdatePostingRuleDto
  ) {
    const tenantId = tenantHeader || 'default-tenant';
    return this.glService.updatePostingRule(tenantId, code, dto);
  }

  @Delete('accounts/:id')
  @ApiOperation({ summary: 'Archive a GL Account' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  public archiveAccount(@Headers('x-tenant-id') tenantHeader: string, @Param('id') accountId: string) {
    const tenantId = tenantHeader || 'default-tenant';
    return this.glService.archiveAccount(tenantId, accountId);
  }

  @Get('chart-of-accounts')
  @ApiOperation({ summary: 'Get Chart of Accounts Read Model' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  public getChartOfAccounts(@Headers('x-tenant-id') tenantHeader: string) {
    const tenantId = tenantHeader || 'default-tenant';
    return this.glService.getChartOfAccounts(tenantId);
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get Account Hierarchy Read Model' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  public getAccountHierarchy(@Headers('x-tenant-id') tenantHeader: string) {
    const tenantId = tenantHeader || 'default-tenant';
    return this.glService.getAccountHierarchy(tenantId);
  }

  @Get('posting-rules')
  @ApiOperation({ summary: 'Get Posting Rules Catalog Read Model' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  public getPostingRules(@Headers('x-tenant-id') tenantHeader: string) {
    const tenantId = tenantHeader || 'default-tenant';
    return this.glService.getPostingRules(tenantId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get Account Statistics Read Model' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  public getAccountStatistics(@Headers('x-tenant-id') tenantHeader: string) {
    const tenantId = tenantHeader || 'default-tenant';
    return this.glService.getAccountStatistics(tenantId);
  }
}
