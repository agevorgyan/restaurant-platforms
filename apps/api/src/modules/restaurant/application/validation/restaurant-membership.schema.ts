import { CreateRestaurantMembershipDto, UpdateRestaurantMembershipDto } from '../dto/restaurant-membership.dto';

export const validateCreateRestaurantMembership = (dto: CreateRestaurantMembershipDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.userId) errors.push('userId is required');
  if (!dto.role) errors.push('role is required');
  
  const validRoles = ['Owner', 'Admin', 'Manager', 'Cashier', 'Kitchen', 'Waiter', 'Delivery', 'Accountant', 'Custom'];
  if (dto.role && !validRoles.includes(dto.role)) {
    errors.push(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }
  return errors;
};

export const validateUpdateRestaurantMembership = (dto: UpdateRestaurantMembershipDto): string[] => {
  const errors: string[] = [];
  
  if (dto.role) {
    const validRoles = ['Owner', 'Admin', 'Manager', 'Cashier', 'Kitchen', 'Waiter', 'Delivery', 'Accountant', 'Custom'];
    if (!validRoles.includes(dto.role)) {
      errors.push(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }
  }

  if (dto.status) {
    const validStatuses = ['Pending', 'Active', 'Suspended', 'Removed'];
    if (!validStatuses.includes(dto.status)) {
      errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  return errors;
};
