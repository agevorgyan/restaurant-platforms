export class ColorPalette {
  constructor(
    public readonly primary: string,
    public readonly secondary: string,
    public readonly accent: string,
    public readonly background: string,
    public readonly surface: string,
    public readonly text: string,
    public readonly success: string,
    public readonly warning: string,
    public readonly error: string,
  ) {
    this.validateHex(primary, 'primary');
    this.validateHex(secondary, 'secondary');
    this.validateHex(accent, 'accent');
    this.validateHex(background, 'background');
    this.validateHex(surface, 'surface');
    this.validateHex(text, 'text');
    this.validateHex(success, 'success');
    this.validateHex(warning, 'warning');
    this.validateHex(error, 'error');
  }

  private validateHex(color: string, field: string): void {
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    if (!hexRegex.test(color)) {
      throw new Error(`Invalid HEX color for ${field}: ${color}`);
    }
  }
}
