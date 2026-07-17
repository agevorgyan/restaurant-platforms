import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { ModifierGroupService } from '../../application/services/modifier-group.service';
import { CreateModifierGroupDto, UpdateModifierGroupDto } from '../../application/dto/modifier-group.dto';

@Controller('modifier-groups')
export class ModifierGroupController {
  constructor(private readonly modifierGroupService: ModifierGroupService) {}

  @Post()
  async create(@Body() dto: CreateModifierGroupDto) {
    return this.modifierGroupService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateModifierGroupDto) {
    return this.modifierGroupService.update(id, dto);
  }
}
