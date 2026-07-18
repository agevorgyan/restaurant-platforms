import { ISupplierPriceListRepository } from '../repositories/supplier-price-list.repository.interface';
import { ISupplierPriceList } from '../entities/supplier-price-list.interface';
import { PriceListStatus } from '../value-objects/price-list-status.value-object';
import { PriceValidityPeriod } from '../value-objects/price-validity-period.value-object';
import { CreateSupplierPriceListDto } from '../../application/dto/supplier-price-list.dto';
import {
  SupplierPriceListCreatedEvent,
  SupplierPriceListPublishedEvent,
  SupplierPriceUpdatedEvent
} from '../events/supplier-price-list.events';

export class SupplierPriceListDomainService {
  constructor(private readonly priceListRepository: ISupplierPriceListRepository) {}

  async createPriceList(id: string, dto: CreateSupplierPriceListDto): Promise<ISupplierPriceList> {
    const priceList: ISupplierPriceList = {
      id,
      restaurantId: dto.restaurantId,
      supplierId: dto.supplierId,
      name: dto.name,
      status: new PriceListStatus('Draft'),
      currency: dto.currency,
      validityPeriod: new PriceValidityPeriod(dto.validityStartDate, dto.validityEndDate),
      items: dto.items.map(item => {
        if (item.unitPrice <= 0) throw new Error('Unit price must be greater than zero');
        if (item.minimumQuantity <= 0) throw new Error('Minimum order quantity must be greater than zero');
        return {
          ingredientId: item.ingredientId,
          unitPrice: item.unitPrice,
          minimumQuantity: item.minimumQuantity,
          discountPercent: item.discountPercent
        };
      }),
      domainEvents: [new SupplierPriceListCreatedEvent(id, dto.restaurantId)],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.priceListRepository.save(priceList);
    return priceList;
  }

  async publishPriceList(id: string): Promise<ISupplierPriceList> {
    const priceList = await this.priceListRepository.findById(id);
    if (!priceList) throw new Error('Price list not found');

    if (priceList.status.isArchived()) {
      throw new Error('Archived price lists are immutable');
    }

    const publishedLists = await this.priceListRepository.findPublishedBySupplier(priceList.supplierId);
    
    for (const publishedList of publishedLists) {
      if (publishedList.id === priceList.id) continue;
      
      const publishedIngredients = new Set(publishedList.items.map(i => i.ingredientId));
      const overlappingIngredients = priceList.items.filter(i => publishedIngredients.has(i.ingredientId));

      if (overlappingIngredients.length > 0 && priceList.validityPeriod.overlapsWith(publishedList.validityPeriod)) {
        throw new Error('Price validity periods must not overlap for the same ingredient within the same supplier');
      }
    }

    priceList.status = new PriceListStatus('Published');
    priceList.domainEvents = priceList.domainEvents || [];
    priceList.domainEvents.push(new SupplierPriceListPublishedEvent(priceList.id, priceList.restaurantId));
    priceList.updatedAt = new Date();
    await this.priceListRepository.save(priceList);
    return priceList;
  }

  async updatePriceItem(
    priceListId: string, 
    ingredientId: string, 
    unitPrice: number, 
    minimumQuantity: number, 
    discountPercent: number
  ): Promise<ISupplierPriceList> {
    const priceList = await this.priceListRepository.findById(priceListId);
    if (!priceList) throw new Error('Price list not found');

    if (priceList.status.isArchived()) {
      throw new Error('Archived price lists are immutable');
    }

    if (unitPrice <= 0) throw new Error('Unit price must be greater than zero');
    if (minimumQuantity <= 0) throw new Error('Minimum order quantity must be greater than zero');
    if (discountPercent < 0) throw new Error('Discount percent cannot be negative');

    const item = priceList.items.find(i => i.ingredientId === ingredientId);
    if (!item) throw new Error('Price list item not found');

    item.unitPrice = unitPrice;
    item.minimumQuantity = minimumQuantity;
    item.discountPercent = discountPercent;

    priceList.domainEvents = priceList.domainEvents || [];
    priceList.domainEvents.push(new SupplierPriceUpdatedEvent(priceList.id, ingredientId, priceList.restaurantId));
    priceList.updatedAt = new Date();
    await this.priceListRepository.save(priceList);
    return priceList;
  }

  async archivePriceList(id: string): Promise<ISupplierPriceList> {
    const priceList = await this.priceListRepository.findById(id);
    if (!priceList) throw new Error('Price list not found');

    priceList.status = new PriceListStatus('Archived');
    priceList.updatedAt = new Date();
    await this.priceListRepository.save(priceList);
    return priceList;
  }
}
