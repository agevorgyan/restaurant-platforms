import { ISupplierRepository } from '../repositories/supplier.repository.interface';
import { ISupplier } from '../entities/supplier.interface';
import { ISupplierContact } from '../entities/supplier-contact.interface';
import { SupplierStatus } from '../value-objects/supplier-status.value-object';
import { SupplierType, SupplierTypeValue } from '../value-objects/supplier-type.value-object';
import { SupplierCode } from '../value-objects/supplier-code.value-object';
import { SupplierAddress } from '../value-objects/supplier-address.value-object';
import { SupplierPaymentTerms } from '../value-objects/supplier-payment-terms.value-object';
import { CreateSupplierDto, UpdateSupplierDto, SupplierContactDto } from '../../application/dto/supplier.dto';
import {
  SupplierCreatedEvent,
  SupplierUpdatedEvent,
  SupplierActivatedEvent,
  SupplierDeactivatedEvent,
  SupplierArchivedEvent
} from '../events/supplier.events';

export class SupplierDomainService {
  constructor(private readonly repository: ISupplierRepository) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async createSupplier(id: string, dto: CreateSupplierDto): Promise<ISupplier> {
    const existingCode = await this.repository.findBySupplierCode(dto.restaurantId, dto.supplierCode);
    if (existingCode) {
      throw new Error(`Supplier code ${dto.supplierCode} already exists for this restaurant`);
    }

    if (dto.taxNumber) {
      const existingTax = await this.repository.findByTaxNumber(dto.restaurantId, dto.taxNumber);
      if (existingTax) {
        throw new Error(`Tax number ${dto.taxNumber} is already in use by another supplier`);
      }
    }

    const contacts: ISupplierContact[] = (dto.contacts || []).map(c => ({
      id: c.id || this.generateId(),
      name: c.name,
      position: c.position,
      email: c.email,
      phone: c.phone,
      isPrimary: c.isPrimary
    }));

    const supplier: ISupplier = {
      id,
      restaurantId: dto.restaurantId,
      supplierCode: new SupplierCode(dto.supplierCode),
      name: dto.name,
      legalName: dto.legalName,
      taxNumber: dto.taxNumber,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
      status: new SupplierStatus('Draft'),
      type: new SupplierType(dto.type as SupplierTypeValue),
      paymentTerms: dto.paymentTerms ? new SupplierPaymentTerms(dto.paymentTerms) : undefined,
      address: dto.address ? new SupplierAddress(
        dto.address.street,
        dto.address.city,
        dto.address.state,
        dto.address.postalCode,
        dto.address.country
      ) : undefined,
      contacts,
      notes: dto.notes,
      domainEvents: [new SupplierCreatedEvent(id, dto.restaurantId)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.repository.save(supplier);
    return supplier;
  }

  async updateSupplier(id: string, dto: UpdateSupplierDto): Promise<ISupplier> {
    const supplier = await this.repository.findById(id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    if (supplier.status.isArchived()) {
      throw new Error('Archived suppliers are read-only');
    }

    if (dto.taxNumber && dto.taxNumber !== supplier.taxNumber) {
      const existingTax = await this.repository.findByTaxNumber(supplier.restaurantId, dto.taxNumber);
      if (existingTax) {
        throw new Error(`Tax number ${dto.taxNumber} is already in use by another supplier`);
      }
    }

    if (dto.name !== undefined) supplier.name = dto.name;
    if (dto.legalName !== undefined) supplier.legalName = dto.legalName;
    if (dto.taxNumber !== undefined) supplier.taxNumber = dto.taxNumber;
    if (dto.email !== undefined) supplier.email = dto.email;
    if (dto.phone !== undefined) supplier.phone = dto.phone;
    if (dto.website !== undefined) supplier.website = dto.website;
    if (dto.type !== undefined) supplier.type = new SupplierType(dto.type as SupplierTypeValue);
    if (dto.paymentTerms !== undefined) supplier.paymentTerms = dto.paymentTerms ? new SupplierPaymentTerms(dto.paymentTerms) : undefined;
    if (dto.notes !== undefined) supplier.notes = dto.notes;
    
    if (dto.address !== undefined) {
      supplier.address = dto.address ? new SupplierAddress(
        dto.address.street,
        dto.address.city,
        dto.address.state,
        dto.address.postalCode,
        dto.address.country
      ) : undefined;
    }

    supplier.updatedAt = new Date();
    await this.repository.save(supplier);
    return supplier;
  }

  async activateSupplier(id: string): Promise<ISupplier> {
    const supplier = await this.repository.findById(id);
    if (!supplier) throw new Error('Supplier not found');
    if (supplier.status.isArchived()) throw new Error('Archived suppliers are read-only');

    supplier.status = new SupplierStatus('Active');
    supplier.domainEvents = supplier.domainEvents || [];
    supplier.domainEvents.push(new SupplierActivatedEvent(supplier.id, supplier.restaurantId));
    supplier.updatedAt = new Date();
    await this.repository.save(supplier);
    return supplier;
  }

  async deactivateSupplier(id: string): Promise<ISupplier> {
    const supplier = await this.repository.findById(id);
    if (!supplier) throw new Error('Supplier not found');
    if (supplier.status.isArchived()) throw new Error('Archived suppliers are read-only');

    supplier.status = new SupplierStatus('Inactive');
    supplier.domainEvents = supplier.domainEvents || [];
    supplier.domainEvents.push(new SupplierDeactivatedEvent(supplier.id, supplier.restaurantId));
    supplier.updatedAt = new Date();
    await this.repository.save(supplier);
    return supplier;
  }

  async archiveSupplier(id: string): Promise<ISupplier> {
    const supplier = await this.repository.findById(id);
    if (!supplier) throw new Error('Supplier not found');

    supplier.status = new SupplierStatus('Archived');
    supplier.domainEvents = supplier.domainEvents || [];
    supplier.domainEvents.push(new SupplierArchivedEvent(supplier.id, supplier.restaurantId));
    supplier.updatedAt = new Date();
    await this.repository.save(supplier);
    return supplier;
  }

  async addContact(supplierId: string, contactDto: SupplierContactDto): Promise<ISupplier> {
    const supplier = await this.repository.findById(supplierId);
    if (!supplier) throw new Error('Supplier not found');
    if (supplier.status.isArchived()) throw new Error('Archived suppliers are read-only');

    if (contactDto.isPrimary) {
      supplier.contacts.forEach(c => c.isPrimary = false);
    } else {
      if (supplier.contacts.length === 0) {
        contactDto.isPrimary = true;
      }
    }

    supplier.contacts.push({
      id: contactDto.id || this.generateId(),
      name: contactDto.name,
      position: contactDto.position,
      email: contactDto.email,
      phone: contactDto.phone,
      isPrimary: contactDto.isPrimary
    });

    supplier.domainEvents = supplier.domainEvents || [];
    supplier.domainEvents.push(new SupplierUpdatedEvent(supplier.id, supplier.restaurantId));
    supplier.updatedAt = new Date();
    await this.repository.save(supplier);
    return supplier;
  }

  async updateContact(supplierId: string, contactId: string, contactDto: Partial<SupplierContactDto>): Promise<ISupplier> {
    const supplier = await this.repository.findById(supplierId);
    if (!supplier) throw new Error('Supplier not found');
    if (supplier.status.isArchived()) throw new Error('Archived suppliers are read-only');

    const contact = supplier.contacts.find(c => c.id === contactId);
    if (!contact) throw new Error('Contact not found');

    if (contactDto.isPrimary !== undefined) {
      if (contactDto.isPrimary) {
        supplier.contacts.forEach(c => c.isPrimary = false);
        contact.isPrimary = true;
      } else {
        if (contact.isPrimary) {
          throw new Error('Cannot unset the only primary contact. Set another contact as primary instead.');
        }
        contact.isPrimary = false;
      }
    }

    if (contactDto.name !== undefined) contact.name = contactDto.name;
    if (contactDto.position !== undefined) contact.position = contactDto.position;
    if (contactDto.email !== undefined) contact.email = contactDto.email;
    if (contactDto.phone !== undefined) contact.phone = contactDto.phone;

    supplier.domainEvents = supplier.domainEvents || [];
    supplier.domainEvents.push(new SupplierUpdatedEvent(supplier.id, supplier.restaurantId));
    supplier.updatedAt = new Date();
    await this.repository.save(supplier);
    return supplier;
  }

  async removeContact(supplierId: string, contactId: string): Promise<ISupplier> {
    const supplier = await this.repository.findById(supplierId);
    if (!supplier) throw new Error('Supplier not found');
    if (supplier.status.isArchived()) throw new Error('Archived suppliers are read-only');

    const contactIndex = supplier.contacts.findIndex(c => c.id === contactId);
    if (contactIndex === -1) throw new Error('Contact not found');

    const contact = supplier.contacts[contactIndex];
    if (contact.isPrimary && supplier.contacts.length > 1) {
      throw new Error('Cannot remove the primary contact. Set another contact as primary first.');
    }

    supplier.contacts.splice(contactIndex, 1);
    
    if (supplier.contacts.length > 0 && !supplier.contacts.some(c => c.isPrimary)) {
      supplier.contacts[0].isPrimary = true;
    }

    supplier.domainEvents = supplier.domainEvents || [];
    supplier.domainEvents.push(new SupplierUpdatedEvent(supplier.id, supplier.restaurantId));
    supplier.updatedAt = new Date();
    await this.repository.save(supplier);
    return supplier;
  }
}
