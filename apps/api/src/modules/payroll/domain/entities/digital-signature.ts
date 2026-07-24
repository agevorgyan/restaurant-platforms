import { Entity, Identifier } from '@saas/domain';

export class DigitalSignatureId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DigitalSignatureId { return new DigitalSignatureId(value); }
  public static generate(): DigitalSignatureId { return new DigitalSignatureId(crypto.randomUUID()); }
}

export class DigitalSignature extends Entity<DigitalSignatureId> {
  constructor(
    id: DigitalSignatureId,
    public readonly signerId: string,
    public readonly signerName: string,
    public readonly signatureHash: string,
    public readonly timestamp: Date
  ) {
    super(id);
  }

  public static create(signerId: string, signerName: string, signatureHash: string): DigitalSignature {
    return new DigitalSignature(DigitalSignatureId.generate(), signerId, signerName, signatureHash, new Date());
  }
}
