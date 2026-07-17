import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { ModifierOptionService } from '../../application/services/modifier-option.service';
import { CreateModifierOptionDto, UpdateModifierOptionDto } from '../../application/dto/modifier-option.dto';

@Controller('modifier-options')
export class ModifierOptionController {
  constructor(private readonly modifierOptionService: ModifierOptionService) {}

  @Post()
  async create(@Body() dto: CreateModifierOptionDto) {
    return this.modifierOptionService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateModifierOptionDto) {
    return this.modifierOptionService.update(id, dto);
  }
}
