import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { ProductService } from '../../application/services/product.service';
import { CreateProductDto, UpdateProductDto } from '../../application/dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }
}
