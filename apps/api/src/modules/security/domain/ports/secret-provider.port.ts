export interface ISecretProviderAdapter {
  getSecretValue(path: string, version?: string): Promise<string>;
  storeSecretValue(path: string, value: string): Promise<string>;
  rotateSecret(path: string, newValue: string): Promise<string>;
  deleteSecret(path: string): Promise<void>;
  
  encryptData(keyId: string, plaintext: Buffer): Promise<Buffer>;
  decryptData(keyId: string, ciphertext: Buffer): Promise<Buffer>;
  
  issueCertificate(commonName: string, validityDays: number): Promise<{ certificate: string, privateKey: string }>;
}
