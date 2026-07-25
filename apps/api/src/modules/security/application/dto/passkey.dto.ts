export class PasskeyRegisterDto {
  userId!: string;
  // FIDO2 attestation object
  attestationObject!: string;
  clientDataJSON!: string;
}

export class PasskeyAuthenticateDto {
  // FIDO2 assertion object
  credentialId!: string;
  authenticatorData!: string;
  clientDataJSON!: string;
  signature!: string;
}
