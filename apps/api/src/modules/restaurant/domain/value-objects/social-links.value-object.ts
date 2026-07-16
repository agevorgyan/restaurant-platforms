export class SocialLinks {
  constructor(
    public readonly facebook?: string,
    public readonly instagram?: string,
    public readonly telegram?: string,
    public readonly whatsapp?: string,
  ) {
    if (facebook) this.validateUrl(facebook, 'facebook');
    if (instagram) this.validateUrl(instagram, 'instagram');
    if (telegram) this.validateUrl(telegram, 'telegram');
    if (whatsapp) this.validateUrl(whatsapp, 'whatsapp');
  }

  private validateUrl(url: string, field: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL format for ${field}: ${url}`);
    }
  }
}
