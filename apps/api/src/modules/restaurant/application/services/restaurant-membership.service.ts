import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IRestaurantMembershipRepository } from '../../domain/repositories/restaurant-membership.repository.interface';
import { IRestaurantMembership } from '../../domain/entities/restaurant-membership.interface';
import { MembershipRole, MembershipRoleType } from '../../domain/value-objects/membership-role.value-object';
import { MembershipStatus, MembershipStatusType } from '../../domain/value-objects/membership-status.value-object';
import { CreateRestaurantMembershipDto, UpdateRestaurantMembershipDto } from '../dto/restaurant-membership.dto';
import { validateCreateRestaurantMembership, validateUpdateRestaurantMembership } from '../validation/restaurant-membership.schema';
import { RestaurantMembershipCreatedEvent } from '../../domain/events/restaurant-membership-created.event';
import { RestaurantMembershipUpdatedEvent } from '../../domain/events/restaurant-membership-updated.event';
import { RestaurantMembershipRemovedEvent } from '../../domain/events/restaurant-membership-removed.event';

@Injectable()
export class RestaurantMembershipService {
  constructor(
    @Inject('IRestaurantMembershipRepository')
    private readonly repository: IRestaurantMembershipRepository,
  ) {}

  async create(dto: CreateRestaurantMembershipDto): Promise<IRestaurantMembership> {
    const errors = validateCreateRestaurantMembership(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const role = new MembershipRole(dto.role as MembershipRoleType);
    
    // Rule: Only one Owner per restaurant
    if (role.isOwner()) {
      const ownersCount = await this.repository.countOwnersByRestaurantId(dto.restaurantId);
      if (ownersCount > 0) {
        throw new BadRequestException('Restaurant already has an Owner');
      }
    }

    const status = new MembershipStatus('Pending');

    const membership: IRestaurantMembership = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      userId: dto.userId,
      role: role,
      status: status,
      branchIds: dto.branchIds || [],
      invitedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(membership);
    // Instantiate event as per domain requirements
    new RestaurantMembershipCreatedEvent(created);
    return created;
  }

  async update(id: string, dto: UpdateRestaurantMembershipDto): Promise<IRestaurantMembership> {
    const errors = validateUpdateRestaurantMembership(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const membership = await this.repository.findById(id);
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }

    const updates: Partial<IRestaurantMembership> = { updatedAt: new Date() };

    if (dto.role) {
      const newRole = new MembershipRole(dto.role as MembershipRoleType);
      
      if (membership.role.isOwner() && !newRole.isOwner()) {
        throw new BadRequestException('Cannot change the role of the Owner');
      }
      
      if (!membership.role.isOwner() && newRole.isOwner()) {
        const ownersCount = await this.repository.countOwnersByRestaurantId(membership.restaurantId);
        if (ownersCount > 0) {
          throw new BadRequestException('Restaurant already has an Owner');
        }
      }

      updates.role = newRole;
    }

    if (dto.status) {
      const newStatus = new MembershipStatus(dto.status as MembershipStatusType);
      
      if (!membership.status.canTransitionTo(newStatus.value)) {
        throw new BadRequestException(`Cannot transition status from ${membership.status.value} to ${newStatus.value}`);
      }

      updates.status = newStatus;
      if (newStatus.value === 'Active' && membership.status.value === 'Pending') {
        updates.joinedAt = new Date();
      }
    }

    if (dto.branchIds) {
      updates.branchIds = dto.branchIds;
    }

    const updated = await this.repository.update(id, updates);
    // Instantiate event as per domain requirements
    new RestaurantMembershipUpdatedEvent(updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const membership = await this.repository.findById(id);
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }

    if (membership.role.isOwner()) {
      throw new BadRequestException('Owner cannot be removed while ownership exists');
    }

    await this.repository.remove(id);
    // Instantiate event as per domain requirements
    new RestaurantMembershipRemovedEvent(id, membership.restaurantId);
  }

  async findByRestaurant(restaurantId: string): Promise<IRestaurantMembership[]> {
    return this.repository.findByRestaurantId(restaurantId);
  }

  async findByUser(userId: string): Promise<IRestaurantMembership[]> {
    return this.repository.findByUserId(userId);
  }
}
