import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from '../../application/services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../application/dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
