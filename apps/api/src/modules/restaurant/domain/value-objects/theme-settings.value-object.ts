export class ThemeSettings {
  constructor(
    public readonly primaryColor: string,
    public readonly secondaryColor: string,
    public readonly fontFamily: string,
    public readonly borderRadius: string,
    public readonly layoutStyle: 'modern' | 'classic' | 'minimalist',
  ) {}
}
