export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
};

export type ThemeColors = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
};

export type ThemeTypography = {
  fontFamily: {
    sans: string[];
    serif: string[];
    mono: string[];
    heading: string[];
  };
};

export type ThemeRadii = {
  radius: string; // e.g. "0.5rem"
};

export type RestaurantTheme = {
  id: string;
  name: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  typography: ThemeTypography;
  radii: ThemeRadii;
};
