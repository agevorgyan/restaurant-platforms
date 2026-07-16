import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({ description: 'The name of the restaurant' })
  name!: string;

  @ApiProperty({ description: 'The URL slug for the restaurant' })
  slug!: string;

  @ApiProperty({ description: 'The parent organization ID' })
  organizationId!: string;
}

export class RestaurantResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  organizationId!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;
}
