import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Address } from '../../domain';

export class CreateBranchDto {
  @ApiProperty({ description: 'The parent restaurant ID' })
  restaurantId!: string;

  @ApiProperty({ description: 'The name of the branch' })
  name!: string;

  @ApiProperty({ description: 'The physical address' })
  address!: Address;

  @ApiPropertyOptional({ description: 'Phone number' })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  email?: string;

  @ApiProperty({ description: 'Timezone string' })
  timezone!: string;

  @ApiProperty({ description: 'Is this the main branch?' })
  isMainBranch!: boolean;
}

export class BranchResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  restaurantId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  address!: Address;

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiProperty()
  timezone!: string;

  @ApiProperty()
  isMainBranch!: boolean;

  @ApiProperty()
  status!: 'active' | 'inactive' | 'temporarily_closed';

  @ApiProperty()
  createdAt!: Date;
}
