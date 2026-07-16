import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty({ description: 'The parent restaurant ID' })
  restaurantId!: string;

  @ApiProperty({ description: 'The name of the branch' })
  name!: string;

  @ApiProperty({ description: 'The branch code identifier' })
  code!: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  email?: string;

  @ApiProperty({ description: 'Timezone string' })
  timezone!: string;

  @ApiProperty({ description: 'Operating Currency' })
  currency!: string;
}

export class BranchResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  restaurantId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  status!: 'active' | 'inactive' | 'temporarily_closed';

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiProperty()
  timezone!: string;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  createdAt!: Date;
}
