export class PasswordResetDto {
  email!: string;
}

export class PasswordChangeDto {
  oldPassword!: string;
  newPassword!: string;
}
