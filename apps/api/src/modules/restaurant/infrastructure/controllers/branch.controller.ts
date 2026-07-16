import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BranchService } from '../../application/services';
import { CreateBranchDto, BranchResponseDto } from '../../application/dto';

@ApiTags('Branch')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({ status: 201, description: 'The branch has been successfully created.', type: BranchResponseDto })
  async createBranch(@Body() createBranchDto: CreateBranchDto): Promise<BranchResponseDto> {
    return this.branchService.createBranch(createBranchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiResponse({ status: 200, description: 'Return the branch.', type: BranchResponseDto })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  async getBranch(@Param('id') id: string): Promise<BranchResponseDto> {
    const branch = await this.branchService.getBranchById(id);
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    return branch;
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get branches by restaurant ID' })
  @ApiResponse({ status: 200, description: 'Return the branches.', type: [BranchResponseDto] })
  async getBranchesByRestaurant(@Param('restaurantId') restaurantId: string): Promise<BranchResponseDto[]> {
    return this.branchService.getBranchesByRestaurant(restaurantId);
  }
}
