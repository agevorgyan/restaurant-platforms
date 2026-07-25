import { Injectable } from '@nestjs/common';
import { ISecretProviderAdapter } from '../../domain/ports/secret-provider.port';

@Injectable()
export class LocalSecretProvider implements ISecretProviderAdapter {
  private secrets = new Map<string, string>();
  private keys = new Map<string, Buffer>();

  async getSecretValue(path: string, version?: string): Promise<string> {
    return this.secrets.get(path) || '';
  }

  async storeSecretValue(path: string, value: string): Promise<string> {
    this.secrets.set(path, value);
    return 'v1';
  }

  async rotateSecret(path: string, newValue: string): Promise<string> {
    this.secrets.set(path, newValue);
    return 'v2';
  }

  async deleteSecret(path: string): Promise<void> {
    this.secrets.delete(path);
  }

  async encryptData(keyId: string, plaintext: Buffer): Promise<Buffer> {
    return plaintext;
  }

  async decryptData(keyId: string, ciphertext: Buffer): Promise<Buffer> {
    return ciphertext;
  }

  async issueCertificate(commonName: string, validityDays: number): Promise<{ certificate: string; privateKey: string }> {
    return { certificate: 'CERT', privateKey: 'KEY' };
  }
}
