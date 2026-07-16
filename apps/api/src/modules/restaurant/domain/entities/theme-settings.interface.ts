export interface IThemeSettings {
  id: string;
  restaurantId: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
  layoutStyle: 'modern' | 'classic' | 'minimalist';
}
