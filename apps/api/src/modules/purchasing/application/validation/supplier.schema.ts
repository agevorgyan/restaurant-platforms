import { CreateSupplierDto, UpdateSupplierDto, SupplierContactDto } from '../dto/supplier.dto';

const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const validateSupplierContact = (contact: SupplierContactDto, index: number): string[] => {
  const errors: string[] = [];
  if (!contact.name || contact.name.trim() === '') errors.push(`Contact [${index}]: name is required`);
  if (contact.email && !emailRegex.test(contact.email)) errors.push(`Contact [${index}]: email is invalid`);
  return errors;
};

export const validateCreateSupplier = (dto: CreateSupplierDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.supplierCode || dto.supplierCode.trim() === '') errors.push('supplierCode is required');
  if (!dto.name || dto.name.trim() === '') errors.push('name is required');
  if (!dto.type || dto.type.trim() === '') errors.push('type is required');
  
  if (dto.email && !emailRegex.test(dto.email)) errors.push('email is invalid');
  if (dto.website && !urlRegex.test(dto.website)) errors.push('website is invalid');

  if (dto.contacts && Array.isArray(dto.contacts)) {
    let primaryCount = 0;
    dto.contacts.forEach((contact, index) => {
      errors.push(...validateSupplierContact(contact, index));
      if (contact.isPrimary) primaryCount++;
    });
    if (primaryCount > 1) {
      errors.push('Only one primary contact is allowed');
    }
  }

  if (dto.address) {
    if (!dto.address.country || dto.address.country.trim() === '') {
      errors.push('Address: country is required');
    }
  }

  return errors;
};

export const validateUpdateSupplier = (dto: UpdateSupplierDto): string[] => {
  const errors: string[] = [];
  
  if (dto.name !== undefined && dto.name.trim() === '') errors.push('name cannot be empty');
  if (dto.email !== undefined && dto.email && !emailRegex.test(dto.email)) errors.push('email is invalid');
  if (dto.website !== undefined && dto.website && !urlRegex.test(dto.website)) errors.push('website is invalid');
  if (dto.type !== undefined && dto.type.trim() === '') errors.push('type cannot be empty');

  if (dto.address !== undefined) {
    if (!dto.address.country || dto.address.country.trim() === '') {
      errors.push('Address: country is required');
    }
  }

  return errors;
};
