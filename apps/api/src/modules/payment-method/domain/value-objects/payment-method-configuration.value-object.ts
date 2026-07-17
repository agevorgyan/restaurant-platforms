export type PaymentProviderType = 'Manual' | 'Stripe' | 'PayPal' | 'Square' | 'Adyen' | 'Ameriabank' | 'Idram' | 'Telcell' | 'Custom';

export class PaymentMethodConfiguration {
  constructor(
    public readonly provider: PaymentProviderType,
    public readonly settings: Record<string, any>
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.provider === 'Manual') {
      // Manual might not need strict settings
      return;
    }

    if (!this.settings || Object.keys(this.settings).length === 0) {
      throw new Error(`Configuration settings are required for provider: ${this.provider}`);
    }

    // Basic structural validation per provider could go here.
    // E.g., for Stripe we might expect a publicKey or webhookSecret, etc.
    // The instructions say "Do NOT store API secrets."
    // So settings might only contain public keys, merchant IDs, or enablement flags.
  }
}
