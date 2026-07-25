export enum SecretStatus {
  Active = 'Active',
  Rotating = 'Rotating',
  Expired = 'Expired',
  Revoked = 'Revoked',
  Archived = 'Archived',
}

export enum KeyAlgorithm {
  AES256 = 'AES256',
  RSA2048 = 'RSA2048',
  RSA4096 = 'RSA4096',
  ECDSA = 'ECDSA',
  Ed25519 = 'Ed25519',
}
