/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import {
  AuthorizationService,
  RoleService,
  PermissionService,
  PolicyEngineService,
  AuthorizationAuditService,
} from '../../application/services';
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePolicyDto,
  AuthorizeRequestDto,
} from '../../application/dto';

@Controller('security')
export class AuthorizationController {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly policyEngineService: PolicyEngineService,
    private readonly auditService: AuthorizationAuditService,
  ) {}

  @Get('roles')
  async getRoles() {
    return this.roleService.getRoles();
  }

  @Post('roles')
  async createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Patch('roles/:id')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  async deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  @Get('permissions')
  async getPermissions() {
    return this.permissionService.getPermissions();
  }

  @Get('policies')
  async getPolicies() {
    return this.policyEngineService.getPolicies();
  }

  @Post('policies')
  async createPolicy(@Body() dto: CreatePolicyDto) {
    return this.policyEngineService.createPolicy(dto);
  }

  @Post('authorize')
  async authorize(@Body() dto: AuthorizeRequestDto) {
    return this.authorizationService.authorize(dto);
  }

  @Get('authorization/statistics')
  async getStatistics() {
    return this.auditService.getStatistics();
  }
}
