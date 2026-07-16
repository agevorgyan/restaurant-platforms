import { Injectable, Inject } from '@nestjs/common';
import { IBranchRepository, IBranch } from '../../domain';
import { CreateBranchDto, BranchResponseDto } from '../dto';
import { BranchCreatedEvent } from '../../domain/events';

@Injectable()
export class BranchService {
  constructor(
    @Inject('IBranchRepository') private readonly branchRepository: IBranchRepository,
  ) {}

  async createBranch(dto: CreateBranchDto): Promise<BranchResponseDto> {
    const branch: IBranch = {
      id: Math.random().toString(36).substring(7),
      restaurantId: dto.restaurantId,
      name: dto.name,
      address: dto.address,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      timezone: dto.timezone,
      isMainBranch: dto.isMainBranch,
      workingHours: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedBranch = await this.branchRepository.save(branch);

    const event = new BranchCreatedEvent(savedBranch.id, savedBranch.restaurantId, savedBranch.name);
    console.log('Event emitted:', event);

    return this.mapToResponse(savedBranch);
  }

  async getBranchById(id: string): Promise<BranchResponseDto | null> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) return null;
    return this.mapToResponse(branch);
  }

  async getBranchesByRestaurant(restaurantId: string): Promise<BranchResponseDto[]> {
    const branches = await this.branchRepository.findByRestaurantId(restaurantId);
    return branches.map(branch => this.mapToResponse(branch));
  }

  private mapToResponse(branch: IBranch): BranchResponseDto {
    return {
      id: branch.id,
      restaurantId: branch.restaurantId,
      name: branch.name,
      address: branch.address,
      phoneNumber: branch.phoneNumber,
      email: branch.email,
      timezone: branch.timezone,
      isMainBranch: branch.isMainBranch,
      status: branch.status,
      createdAt: branch.createdAt,
    };
  }
}
