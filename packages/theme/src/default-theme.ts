import { RestaurantTheme } from './types';
import { defaultLightColors, defaultDarkColors } from './tokens/colors';
import { defaultTypography } from './tokens/typography';
import { defaultRadii } from './tokens/radii';

export const defaultTheme: RestaurantTheme = {
  id: 'default',
  name: 'Default',
  colors: {
    light: defaultLightColors,
    dark: defaultDarkColors,
  },
  typography: defaultTypography,
  radii: defaultRadii,
};
