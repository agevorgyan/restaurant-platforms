import { RestaurantTheme, ThemeColors } from '../types';

/**
 * Converts a camelCase property name to a kebab-case CSS variable name.
 * e.g., primaryForeground -> --primary-foreground
 */
const toCssVarName = (key: string) => {
  return `--${key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()}`;
};

/**
 * Generates CSS variables block for a given theme colors object.
 */
const generateColorVars = (colors: ThemeColors) => {
  return Object.entries(colors)
    .map(([key, value]) => `${toCssVarName(key)}: ${value};`)
    .join('\n    ');
};

/**
 * Generates the full CSS string for a given RestaurantTheme.
 * This can be injected into a <style> tag in the application's head.
 */
export const generateThemeCss = (theme: RestaurantTheme): string => {
  const lightColors = generateColorVars(theme.colors.light);
  const darkColors = generateColorVars(theme.colors.dark);
  
  return `
    :root {
      ${lightColors}
      --radius: ${theme.radii.radius};
    }
    
    .dark {
      ${darkColors}
    }
  `;
};
