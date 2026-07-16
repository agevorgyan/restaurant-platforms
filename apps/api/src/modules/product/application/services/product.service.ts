import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { IProduct } from '../../domain/entities/product.interface';
import { ProductStatus, ProductStatusType } from '../../domain/value-objects/product-status.value-object';
import { ProductAvailability, ProductAvailabilityType } from '../../domain/value-objects/product-availability.value-object';
import { ProductPrice } from '../../domain/value-objects/product-price.value-object';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { validateCreateProduct, validateUpdateProduct } from '../validation/product.schema';
import { ProductCreatedEvent, ProductUpdatedEvent, ProductArchivedEvent } from '../../domain/events/product.events';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository') private readonly repository: IProductRepository,
  ) {}

  async create(dto: CreateProductDto): Promise<IProduct> {
    const errors = validateCreateProduct(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Rule: SKU must be unique inside the restaurant
    const existingSku = await this.repository.findBySku(dto.restaurantId, dto.sku);
    if (existingSku) {
      throw new BadRequestException(`SKU '${dto.sku}' is already in use for this restaurant`);
    }

    // Rule: Slug must be unique inside the menu
    const existingSlug = await this.repository.findBySlug(dto.menuId, dto.slug);
    if (existingSlug) {
      throw new BadRequestException(`Slug '${dto.slug}' is already taken in this menu`);
    }

    const status = new ProductStatus((dto.status as ProductStatusType) || 'Draft');
    const availability = new ProductAvailability((dto.availability as ProductAvailabilityType) || 'Hidden');
    
    // Rule: Archived products cannot be available
    if (status.isArchived() && availability.value === 'Available') {
      throw new BadRequestException('Archived products cannot be available');
    }

    // VO handles price >= 0 and compareAtPrice >= price validation
    const priceDetails = new ProductPrice(dto.price, dto.currency, dto.compareAtPrice, dto.costPrice);

    const product: IProduct = {
      id: crypto.randomUUID(),
      restaurantId: dto.restaurantId,
      menuId: dto.menuId,
      categoryId: dto.categoryId,
      sku: dto.sku,
      barcode: dto.barcode,
      name: dto.name,
      shortDescription: dto.shortDescription,
      description: dto.description,
      slug: dto.slug,
      priceDetails,
      imageUrl: dto.imageUrl,
      gallery: dto.gallery || [],
      status,
      availability,
      sortOrder: dto.sortOrder || 0,
      isFeatured: dto.isFeatured || false,
      isRecommended: dto.isRecommended || false,
      isVegetarian: dto.isVegetarian || false,
      isVegan: dto.isVegan || false,
      isSpicy: dto.isSpicy || false,
      containsAlcohol: dto.containsAlcohol || false,
      preparationTime: dto.preparationTime || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await this.repository.create(product);
    new ProductCreatedEvent(created);
    return created;
  }

  async update(id: string, dto: UpdateProductDto): Promise<IProduct> {
    const errors = validateUpdateProduct(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updates: Partial<IProduct> = { updatedAt: new Date() };

    if (dto.sku && dto.sku !== product.sku) {
      const existingSku = await this.repository.findBySku(product.restaurantId, dto.sku);
      if (existingSku) {
        throw new BadRequestException(`SKU '${dto.sku}' is already in use for this restaurant`);
      }
      updates.sku = dto.sku;
    }

    if (dto.slug && dto.slug !== product.slug) {
      const existingSlug = await this.repository.findBySlug(product.menuId, dto.slug);
      if (existingSlug) {
        throw new BadRequestException(`Slug '${dto.slug}' is already taken in this menu`);
      }
      updates.slug = dto.slug;
    }

    const newStatus = dto.status ? new ProductStatus(dto.status as ProductStatusType) : product.status;
    const newAvailability = dto.availability ? new ProductAvailability(dto.availability as ProductAvailabilityType) : product.availability;

    // Rule: Archived products cannot be available
    if (newStatus.isArchived() && newAvailability.value === 'Available') {
      throw new BadRequestException('Archived products cannot be available');
    }

    if (dto.status) updates.status = newStatus;
    if (dto.availability) updates.availability = newAvailability;

    const isPriceChanged = dto.price !== undefined || dto.compareAtPrice !== undefined || dto.costPrice !== undefined || dto.currency !== undefined;
    if (isPriceChanged) {
      const price = dto.price !== undefined ? dto.price : product.priceDetails.price;
      const currency = dto.currency !== undefined ? dto.currency : product.priceDetails.currency;
      const compareAtPrice = dto.compareAtPrice !== undefined ? dto.compareAtPrice : product.priceDetails.compareAtPrice;
      const costPrice = dto.costPrice !== undefined ? dto.costPrice : product.priceDetails.costPrice;
      
      updates.priceDetails = new ProductPrice(price, currency, compareAtPrice, costPrice);
    }

    if (dto.categoryId !== undefined) updates.categoryId = dto.categoryId;
    if (dto.barcode !== undefined) updates.barcode = dto.barcode;
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.shortDescription !== undefined) updates.shortDescription = dto.shortDescription;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.imageUrl !== undefined) updates.imageUrl = dto.imageUrl;
    if (dto.gallery !== undefined) updates.gallery = dto.gallery;
    if (dto.sortOrder !== undefined) updates.sortOrder = dto.sortOrder;
    if (dto.isFeatured !== undefined) updates.isFeatured = dto.isFeatured;
    if (dto.isRecommended !== undefined) updates.isRecommended = dto.isRecommended;
    if (dto.isVegetarian !== undefined) updates.isVegetarian = dto.isVegetarian;
    if (dto.isVegan !== undefined) updates.isVegan = dto.isVegan;
    if (dto.isSpicy !== undefined) updates.isSpicy = dto.isSpicy;
    if (dto.containsAlcohol !== undefined) updates.containsAlcohol = dto.containsAlcohol;
    if (dto.preparationTime !== undefined) updates.preparationTime = dto.preparationTime;

    const updated = await this.repository.update(id, updates);
    new ProductUpdatedEvent(updated);
    
    if (newStatus.isArchived() && !product.status.isArchived()) {
      new ProductArchivedEvent(updated.id, updated.restaurantId);
    }

    return updated;
  }
}
