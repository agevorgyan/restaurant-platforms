export class Typography {
  constructor(
    public readonly primaryFont: string,
    public readonly secondaryFont: string,
    public readonly headingScale: number,
    public readonly bodyScale: number,
  ) {
    this.validateFontName(primaryFont, 'primaryFont');
    this.validateFontName(secondaryFont, 'secondaryFont');
    this.validateScale(headingScale, 'headingScale');
    this.validateScale(bodyScale, 'bodyScale');
  }

  private validateFontName(font: string, field: string): void {
    if (!font || font.trim() === '') {
      throw new Error(`Invalid font name for ${field}`);
    }
    const safeFontRegex = /^[a-zA-Z0-9\s,\-'"_]+$/;
    if (!safeFontRegex.test(font)) {
      throw new Error(`Font name contains unsafe characters in ${field}: ${font}`);
    }
  }

  private validateScale(scale: number, field: string): void {
    if (scale <= 0 || scale > 5) {
      throw new Error(`Scale for ${field} must be between 0.1 and 5.0, got ${scale}`);
    }
  }
}
