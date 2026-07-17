import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto, UpdateOrderDto } from '../../application/dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(id, dto);
  }
}
