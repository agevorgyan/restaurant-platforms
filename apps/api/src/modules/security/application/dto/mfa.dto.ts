export class MfaSetupDto {
  method!: string;
}

export class MfaVerifyDto {
  authenticationId!: string;
  code!: string;
}
