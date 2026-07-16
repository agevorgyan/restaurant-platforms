import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The email address of the user' })
  email!: string;

  @ApiProperty({ description: 'The first name of the user' })
  firstName!: string;

  @ApiProperty({ description: 'The last name of the user' })
  lastName!: string;
}

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;
}
