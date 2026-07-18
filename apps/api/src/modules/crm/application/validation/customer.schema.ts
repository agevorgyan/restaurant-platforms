import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';

export function validateCreateCustomer(dto: CreateCustomerDto): string[] {
  const errors: string[] = [];

  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.customerCode) errors.push('customerCode is required');
  if (!dto.customerType) errors.push('customerType is required');

  if (!dto.email && !dto.phone) {
    if (!dto.contacts || dto.contacts.length === 0 || !dto.contacts.some(c => c.email || c.phone)) {
      errors.push('At least one contact method (email or phone) is required directly or in contacts');
    }
  }

  if (dto.contacts) {
    const primaryContacts = dto.contacts.filter(c => c.isPrimary);
    if (primaryContacts.length > 1) {
      errors.push('Only one primary contact is allowed');
    }
  }

  if (dto.addresses) {
    const defaultAddresses = dto.addresses.filter(a => a.isDefault);
    if (defaultAddresses.length > 1) {
      errors.push('Only one default address is allowed');
    }
  }

  if (dto.tags) {
    const tagNames = dto.tags.map(t => t.name);
    const uniqueTags = new Set(tagNames);
    if (tagNames.length !== uniqueTags.size) {
      errors.push('Tags must be unique per customer');
    }
  }

  return errors;
}

export function validateUpdateCustomer(dto: UpdateCustomerDto): string[] {
  const errors: string[] = [];

  if (dto.contacts) {
    const primaryContacts = dto.contacts.filter(c => c.isPrimary);
    if (primaryContacts.length > 1) {
      errors.push('Only one primary contact is allowed');
    }
  }

  if (dto.addresses) {
    const defaultAddresses = dto.addresses.filter(a => a.isDefault);
    if (defaultAddresses.length > 1) {
      errors.push('Only one default address is allowed');
    }
  }

  if (dto.tags) {
    const tagNames = dto.tags.map(t => t.name);
    const uniqueTags = new Set(tagNames);
    if (tagNames.length !== uniqueTags.size) {
      errors.push('Tags must be unique per customer');
    }
  }

  return errors;
}
