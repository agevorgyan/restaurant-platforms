export class AssignPermissionDto {
  permissionCode!: string;
  permissionScope!: string;
}

export class AssignRoleToStaffDto {
  staffId!: string;
}

export class UnassignRoleFromStaffDto {
  staffId!: string;
}
