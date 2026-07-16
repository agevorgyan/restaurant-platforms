import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { MenuService } from '../../application/services/menu.service';
import { CreateMenuDto, UpdateMenuDto } from '../../application/dto/menu.dto';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  async create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto);
  }

  @Get('restaurant/:restaurantId')
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.menuService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.menuService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(id, dto);
  }
}
