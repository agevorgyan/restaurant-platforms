import { ICustomer } from '../entities/customer.interface';
import { ICustomerRepository } from '../repositories/customer.repository.interface';
import { CustomerStatus } from '../value-objects/customer-status.value-object';
import { CustomerType, CustomerTypeValue } from '../value-objects/customer-type.value-object';
import { CustomerCode } from '../value-objects/customer-code.value-object';
import { CreateCustomerDto, UpdateCustomerDto, CustomerAddressDto, CustomerContactDto, CustomerTagDto, CustomerPreferenceDto } from '../../application/dto/customer.dto';
import { validateCreateCustomer, validateUpdateCustomer } from '../../application/validation/customer.schema';
import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  CustomerActivatedEvent,
  CustomerDeactivatedEvent,
  CustomerArchivedEvent
} from '../events/customer.events';

export class CustomerDomainService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async createCustomer(id: string, dto: CreateCustomerDto): Promise<ICustomer> {
    const errors = validateCreateCustomer(dto);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const existing = await this.customerRepository.findByCustomerCode(dto.restaurantId, dto.customerCode);
    if (existing) {
      throw new Error('Customer code must be unique within the restaurant');
    }

    const customer: ICustomer = {
      id,
      restaurantId: dto.restaurantId,
      customerCode: new CustomerCode(dto.customerCode),
      firstName: dto.firstName,
      lastName: dto.lastName,
      companyName: dto.companyName,
      customerType: new CustomerType(dto.customerType as CustomerTypeValue),
      status: new CustomerStatus('Draft'),
      email: dto.email,
      phone: dto.phone,
      dateOfBirth: dto.dateOfBirth,
      addresses: (dto.addresses || []).map(a => ({ id: this.generateId(), ...a })),
      contacts: (dto.contacts || []).map(c => ({ id: this.generateId(), ...c })),
      preferences: dto.preferences || { marketingConsent: false, emailNotifications: true, smsNotifications: false, pushNotifications: false },
      tags: (dto.tags || []).map(t => ({ id: this.generateId(), ...t })),
      notes: dto.notes,
      domainEvents: [new CustomerCreatedEvent(id, dto.restaurantId)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.validateContacts(customer);
    this.validateAddresses(customer);
    this.validateTags(customer);

    await this.customerRepository.save(customer);
    return customer;
  }

  private ensureNotArchived(customer: ICustomer) {
    if (customer.status.isArchived()) {
      throw new Error('Archived customers are read-only');
    }
  }

  private validateContacts(customer: ICustomer) {
    if (!customer.email && !customer.phone) {
      const hasContactMethod = customer.contacts.some(c => c.email || c.phone);
      if (!hasContactMethod) {
        throw new Error('At least one contact method (email or phone) is required');
      }
    }

    const primaryContacts = customer.contacts.filter(c => c.isPrimary);
    if (primaryContacts.length > 1) {
      throw new Error('Only one primary contact is allowed');
    }
  }

  private validateAddresses(customer: ICustomer) {
    const defaultAddresses = customer.addresses.filter(a => a.isDefault);
    if (defaultAddresses.length > 1) {
      throw new Error('Only one default address is allowed');
    }
  }

  private validateTags(customer: ICustomer) {
    const names = customer.tags.map(t => t.name);
    if (new Set(names).size !== names.length) {
      throw new Error('Tags must be unique per customer');
    }
  }

  async updateCustomer(id: string, dto: UpdateCustomerDto): Promise<ICustomer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new Error('Customer not found');

    this.ensureNotArchived(customer);

    const errors = validateUpdateCustomer(dto);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    if (dto.firstName !== undefined) customer.firstName = dto.firstName;
    if (dto.lastName !== undefined) customer.lastName = dto.lastName;
    if (dto.companyName !== undefined) customer.companyName = dto.companyName;
    if (dto.email !== undefined) customer.email = dto.email;
    if (dto.phone !== undefined) customer.phone = dto.phone;
    if (dto.dateOfBirth !== undefined) customer.dateOfBirth = dto.dateOfBirth;
    if (dto.notes !== undefined) customer.notes = dto.notes;

    this.validateContacts(customer);

    customer.updatedAt = new Date();
    customer.domainEvents = customer.domainEvents || [];
    customer.domainEvents.push(new CustomerUpdatedEvent(customer.id, customer.restaurantId));

    await this.customerRepository.save(customer);
    return customer;
  }

  async addAddress(id: string, address: CustomerAddressDto): Promise<ICustomer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new Error('Customer not found');
    this.ensureNotArchived(customer);

    customer.addresses.push({ id: this.generateId(), ...address });
    this.validateAddresses(customer);

    customer.updatedAt = new Date();
    customer.domainEvents = customer.domainEvents || [];
    customer.domainEvents.push(new CustomerUpdatedEvent(customer.id, customer.restaurantId));

    await this.customerRepository.save(customer);
    return customer;
  }

  async addContact(id: string, contact: CustomerContactDto): Promise<ICustomer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new Error('Customer not found');
    this.ensureNotArchived(customer);

    customer.contacts.push({ id: this.generateId(), ...contact });
    this.validateContacts(customer);

    customer.updatedAt = new Date();
    customer.domainEvents = customer.domainEvents || [];
    customer.domainEvents.push(new CustomerUpdatedEvent(customer.id, customer.restaurantId));

    await this.customerRepository.save(customer);
    return customer;
  }

  async addTag(id: string, tag: CustomerTagDto): Promise<ICustomer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new Error('Customer not found');
    this.ensureNotArchived(customer);

    customer.tags.push({ id: this.generateId(), ...tag });
    this.validateTags(customer);

    customer.updatedAt = new Date();
    customer.domainEvents = customer.domainEvents || [];
    customer.domainEvents.push(new CustomerUpdatedEvent(customer.id, customer.restaurantId));

    await this.customerRepository.save(customer);
    return customer;
  }

  async updatePreferences(id: string, preferences: CustomerPreferenceDto): Promise<ICustomer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new Error('Customer not found');
    this.ensureNotArchived(customer);

    customer.preferences = preferences;

    customer.updatedAt = new Date();
    customer.domainEvents = customer.domainEvents || [];
    customer.domainEvents.push(new CustomerUpdatedEvent(customer.id, customer.restaurantId));

    await this.customerRepository.save(customer);
    return customer;
  }

  async activateCustomer(id: string): Promise<ICustomer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new Error('Customer not found');
    this.ensureNotArchived(customer);

    customer.status = new CustomerStatus('Active');
    customer.updatedAt = new Date();
    customer.domainEvents = customer.domainEvents || [];
    customer.domainEvents.push(new CustomerActivatedEvent(customer.id, customer.restaurantId));

    await this.customerRepository.save(customer);
    return customer;
  }

  async deactivateCustomer(id: string): Promise<ICustomer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new Error('Customer not found');
    this.ensureNotArchived(customer);

    customer.status = new CustomerStatus('Inactive');
    customer.updatedAt = new Date();
    customer.domainEvents = customer.domainEvents || [];
    customer.domainEvents.push(new CustomerDeactivatedEvent(customer.id, customer.restaurantId));

    await this.customerRepository.save(customer);
    return customer;
  }

  async archiveCustomer(id: string): Promise<ICustomer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) throw new Error('Customer not found');

    if (!customer.status.isArchived()) {
      customer.status = new CustomerStatus('Archived');
      customer.updatedAt = new Date();
      customer.domainEvents = customer.domainEvents || [];
      customer.domainEvents.push(new CustomerArchivedEvent(customer.id, customer.restaurantId));
      await this.customerRepository.save(customer);
    }
    return customer;
  }
}
