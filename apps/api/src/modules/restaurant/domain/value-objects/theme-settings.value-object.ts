import { ColorPalette } from './color-palette.value-object';
import { Typography } from './typography.value-object';
import { BrandAssets } from './brand-assets.value-object';

export class ThemeSettings {
  constructor(
    public readonly colors: ColorPalette,
    public readonly typography: Typography,
    public readonly assets: BrandAssets,
    public readonly borderRadius: number,
    public readonly buttonStyle: 'solid' | 'outline' | 'ghost',
    public readonly cardStyle: 'flat' | 'shadow' | 'bordered',
    public readonly darkModeEnabled: boolean,
    public readonly animationEnabled: boolean,
  ) {
    this.validateBorderRadius(borderRadius);
  }

  private validateBorderRadius(radius: number): void {
    if (radius < 0 || radius > 50) {
      throw new Error(`Border radius must be between 0 and 50 pixels, got ${radius}`);
    }
  }
}
