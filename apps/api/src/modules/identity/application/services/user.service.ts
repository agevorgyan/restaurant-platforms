import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, IUser } from '../../domain';
import { CreateUserDto, UserResponseDto } from '../dto';
import { UserCreatedEvent } from '../../domain/events';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    // In a real application, we would validate and map this.
    // We would also hash passwords (not implemented here per constraints).
    const user: IUser = {
      id: Math.random().toString(36).substring(7),
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedUser = await this.userRepository.save(user);

    // Emit Domain Event (would use an EventBus in full implementation)
    const event = new UserCreatedEvent(savedUser.id, savedUser.email);
    console.log('Event emitted:', event);

    return this.mapToResponse(savedUser);
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    return this.mapToResponse(user);
  }

  private mapToResponse(user: IUser): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
