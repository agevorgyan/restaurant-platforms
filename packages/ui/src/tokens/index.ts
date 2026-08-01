/**
 * Enterprise Design System - Tokens Definition
 *
 * Defines complete raw & semantic design tokens for color, typography, spacing, radius,
 * elevation, motion, breakpoints, and 12-column grid system.
 */

import {
  Breakpoint,
  ColorToken,
  ElevationToken,
  SpacingToken,
  TypographyToken,
} from '../domain/value-objects/ui-foundation-vo';

// 1. Color Tokens (HSL Tailored Palettes)
export const RAW_COLOR_TOKENS = {
  // Brand Primary (Enterprise Emerald / Deep Indigo)
  primary: {
    50: ColorToken.create('primary.50', 'hsl(210, 100%, 97%)'),
    100: ColorToken.create('primary.100', 'hsl(212, 96%, 90%)'),
    500: ColorToken.create('primary.500', 'hsl(217, 91%, 60%)'),
    600: ColorToken.create('primary.600', 'hsl(221, 83%, 53%)'),
    900: ColorToken.create('primary.900', 'hsl(224, 71%, 15%)'),
  },
  // Neutrals (Slate / Zinc)
  neutral: {
    50: ColorToken.create('neutral.50', 'hsl(210, 40%, 98%)'),
    100: ColorToken.create('neutral.100', 'hsl(214, 32%, 91%)'),
    200: ColorToken.create('neutral.200', 'hsl(213, 27%, 84%)'),
    700: ColorToken.create('neutral.700', 'hsl(215, 25%, 27%)'),
    800: ColorToken.create('neutral.800', 'hsl(217, 33%, 17%)'),
    900: ColorToken.create('neutral.900', 'hsl(222, 47%, 11%)'),
  },
  // Semantics
  success: ColorToken.create('semantic.success', 'hsl(142, 71%, 45%)'),
  warning: ColorToken.create('semantic.warning', 'hsl(38, 92%, 50%)'),
  error: ColorToken.create('semantic.error', 'hsl(0, 84%, 60%)'),
  info: ColorToken.create('semantic.info', 'hsl(199, 89%, 48%)'),
};

// 2. Typography Tokens
export const TYPOGRAPHY_TOKENS = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'Outfit, Inter, sans-serif',
    mono: 'JetBrains Mono, Fira Code, monospace',
  },
  fontSize: {
    xs: TypographyToken.create({ fontFamily: 'Inter', fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 400 }),
    sm: TypographyToken.create({ fontFamily: 'Inter', fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 400 }),
    base: TypographyToken.create({ fontFamily: 'Inter', fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 400 }),
    lg: TypographyToken.create({ fontFamily: 'Inter', fontSize: '1.125rem', lineHeight: '1.75rem', fontWeight: 500 }),
    xl: TypographyToken.create({ fontFamily: 'Outfit', fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: 600 }),
    '2xl': TypographyToken.create({ fontFamily: 'Outfit', fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 700 }),
    '3xl': TypographyToken.create({ fontFamily: 'Outfit', fontSize: '1.875rem', lineHeight: '2.25rem', fontWeight: 700 }),
    '4xl': TypographyToken.create({ fontFamily: 'Outfit', fontSize: '2.25rem', lineHeight: '2.5rem', fontWeight: 800 }),
  },
};

// 3. Spacing Tokens (4px Grid Scale)
export const SPACING_TOKENS: Record<string, SpacingToken> = {
  0: SpacingToken.create('0', 0),
  1: SpacingToken.create('1', 4),
  2: SpacingToken.create('2', 8),
  3: SpacingToken.create('3', 12),
  4: SpacingToken.create('4', 16),
  6: SpacingToken.create('6', 24),
  8: SpacingToken.create('8', 32),
  12: SpacingToken.create('12', 48),
  16: SpacingToken.create('16', 64),
  24: SpacingToken.create('24', 96),
  32: SpacingToken.create('32', 128),
};

// 4. Radius Tokens
export const RADIUS_TOKENS = {
  none: '0px',
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  full: '9999px',
};

// 5. Elevation / Shadow Tokens
export const ELEVATION_TOKENS = {
  sm: ElevationToken.create('sm', '0 1px 2px 0 rgba(0, 0, 0, 0.05)'),
  md: ElevationToken.create('md', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'),
  lg: ElevationToken.create('lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'),
  xl: ElevationToken.create('xl', '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'),
  glass: ElevationToken.create('glass', '0 8px 32px 0 rgba(31, 38, 135, 0.15)'),
};

// 6. Motion Tokens
export const MOTION_TOKENS = {
  durations: {
    fast: 150, // ms
    normal: 250,
    slow: 400,
  },
  easings: {
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  },
};

// 7. Breakpoints
export const BREAKPOINTS: Record<string, Breakpoint> = {
  xs: Breakpoint.create('xs', 320),
  sm: Breakpoint.create('sm', 640),
  md: Breakpoint.create('md', 768),
  lg: Breakpoint.create('lg', 1024),
  xl: Breakpoint.create('xl', 1288),
  '2xl': Breakpoint.create('2xl', 1536),
  '3xl': Breakpoint.create('3xl', 1920),
};

// 8. Responsive Grid System
export const GRID_SYSTEM = {
  columns: 12,
  gutterPx: 24,
  marginPx: 16,
  maxWidths: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};
