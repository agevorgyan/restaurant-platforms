import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from '../../application/services';
import { CreateUserDto, UserResponseDto } from '../../application/dto';

@ApiTags('Identity')
@Controller('identity/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: UserResponseDto })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
