export class BrandAssets {
  constructor(
    public readonly logo: string,
    public readonly darkLogo: string,
    public readonly favicon: string,
    public readonly coverImage: string,
  ) {
    this.validateUrl(logo, 'logo');
    this.validateUrl(darkLogo, 'darkLogo');
    this.validateUrl(favicon, 'favicon');
    this.validateUrl(coverImage, 'coverImage');
  }

  private validateUrl(url: string, field: string): void {
    if (!url) return; // Allow empty for optional assets, otherwise enforce strictly if required.
    // Assuming they must be valid HTTP/HTTPS URLs or valid path URIs.
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL format for ${field}: ${url}`);
    }
  }
}
