/**
 * Enterprise Design System - Read Models (CQRS Projections)
 *
 * Strongly-typed read models for Theme Catalog, Component Catalog, Token Catalog,
 * Accessibility Audit Reports, and Responsive Breakpoint Profiles.
 */

import { ComponentState, ThemeMode } from '../domain/enums/ui-foundation.enums';

export interface ThemeSummaryReadModel {
  themeId: string;
  themeName: string;
  mode: ThemeMode;
  isCustomBrand: boolean;
  tenantId?: string;
  primaryHueHsl: string;
  activeCssVariablesCount: number;
}

export interface ThemeCatalogReadModel {
  totalThemes: number;
  themes: ThemeSummaryReadModel[];
}

export interface ComponentSummaryReadModel {
  componentName: string;
  category: 'Layout' | 'Navigation' | 'Inputs' | 'Data Display' | 'Feedback' | 'Overlays' | 'Charts Wrapper' | 'Utilities';
  supportedStates: ComponentState[];
  supportedVariantsCount: number;
  wcagCompliant: boolean;
}

export interface ComponentCatalogReadModel {
  totalComponents: number;
  byCategory: Record<string, number>;
  components: ComponentSummaryReadModel[];
}

export interface TokenCatalogReadModel {
  totalColorTokens: number;
  totalTypographyTokens: number;
  totalSpacingTokens: number;
  totalRadiusTokens: number;
  totalElevationTokens: number;
  totalBreakpoints: number;
}

export interface AccessibilityReportReadModel {
  wcagLevel: 'WCAG 2.2 AA' | 'WCAG 2.2 AAA';
  overallContrastCompliance: boolean;
  averageContrastRatio: number; // e.g. 7.2:1
  keyboardNavTestedCount: number;
  screenReaderLabelCoveragePercentage: number;
  reducedMotionSupported: boolean;
}

export interface ResponsiveProfilesReadModel {
  supportedBreakpoints: string[];
  fluidGridColumns: number;
  activeTargetApplications: string[];
}
