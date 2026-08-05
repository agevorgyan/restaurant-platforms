import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountType } from '@saas/general-ledger';

export class CreateAccountDto {
  @ApiProperty({ description: 'Account Code (e.g. 1000, 1100.10)' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ description: 'Account Name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: AccountType, description: 'GL Account Type' })
  @IsEnum(AccountType)
  type!: AccountType;

  @ApiPropertyOptional({ description: 'Parent Account ID for hierarchy attachment' })
  @IsString()
  @IsOptional()
  parentAccountId?: string;

  @ApiPropertyOptional({ description: 'Header account flag (direct posting restricted if true)' })
  @IsBoolean()
  @IsOptional()
  isHeaderAccount?: boolean;
}

export class ReparentAccountDto {
  @ApiProperty({ description: 'Target Parent Account ID' })
  @IsString()
  @IsNotEmpty()
  newParentId!: string;
}

export class UpdatePostingRuleDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  allowManualPosting?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  allowAutomatedPosting?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requireDimensionTag?: boolean;
}
