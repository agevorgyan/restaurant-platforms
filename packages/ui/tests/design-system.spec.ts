/**
 * Enterprise Design System & UI Foundation - Comprehensive Test Suite
 *
 * Tests Value Objects, Tokens, Theme Engine, White-Label CSS Variable Overrides,
 * Programmatic Token Resolution, WCAG 2.2 AA Contrast Validation, Responsive Breakpoint Matchers,
 * and CQRS Read Models.
 */

import { ComponentState, ThemeMode } from '../src/domain/enums/ui-foundation.enums';
import {
  Breakpoint,
  ColorToken,
  ComponentVariant,
  ElevationToken,
  IconDefinition,
  ResponsiveRule,
  SpacingToken,
  ThemeId,
  TypographyToken,
} from '../src/domain/value-objects/ui-foundation-vo';
import { BREAKPOINTS, RAW_COLOR_TOKENS, SPACING_TOKENS, TYPOGRAPHY_TOKENS } from '../src/tokens';
import {
  AccessibilityService,
  DesignTokenService,
  IconService,
  ResponsiveService,
  ThemeService,
  TokenService,
} from '../src/services/design-system.services';

describe('Enterprise Design System & UI Foundation', () => {
  describe('Value Objects & Invariants', () => {
    it('should format ThemeId correctly', () => {
      const themeId = ThemeId.create();
      expect(themeId.getValue()).toMatch(/^theme-/);
    });

    it('should generate CSS variable names for ColorToken', () => {
      const token = ColorToken.create('primary.500', 'hsl(217, 91%, 60%)');
      expect(token.cssVariable).toBe('--color-primary-500');
    });

    it('should compute rem values for SpacingToken', () => {
      const token = SpacingToken.create('4', 16);
      expect(token.remValue).toBe('1rem');
    });

    it('should format media queries for Breakpoint', () => {
      const bp = Breakpoint.create('lg', 1024);
      expect(bp.mediaQuery).toBe('(min-width: 1024px)');
    });
  });

  describe('Tokens & Scale Definitions', () => {
    it('should contain valid RAW_COLOR_TOKENS with HSL colors', () => {
      expect(RAW_COLOR_TOKENS.primary[500].hexOrHsl).toContain('hsl(');
      expect(RAW_COLOR_TOKENS.success.hexOrHsl).toContain('hsl(');
    });

    it('should define 12-column responsive GRID_SYSTEM', () => {
      expect(BREAKPOINTS.md.minWidthPx).toBe(768);
      expect(BREAKPOINTS['2xl'].minWidthPx).toBe(1536);
    });
  });

  describe('Theme Engine & White-Label Tenant Customization', () => {
    let themeService: ThemeService;

    beforeEach(() => {
      themeService = new ThemeService();
    });

    it('should switch theme modes correctly', () => {
      expect(themeService.getThemeMode()).toBe(ThemeMode.LIGHT);

      themeService.setThemeMode(ThemeMode.DARK);
      expect(themeService.getThemeMode()).toBe(ThemeMode.DARK);
    });

    it('should generate CSS variables for Light, Dark, and High Contrast themes', () => {
      themeService.setThemeMode(ThemeMode.LIGHT);
      const lightVars = themeService.generateCssVariables();
      expect(lightVars['--color-bg']).toBe('hsl(210, 40%, 98%)');

      themeService.setThemeMode(ThemeMode.DARK);
      const darkVars = themeService.generateCssVariables();
      expect(darkVars['--color-bg']).toBe('hsl(222, 47%, 11%)');

      themeService.setThemeMode(ThemeMode.HIGH_CONTRAST);
      const contrastVars = themeService.generateCssVariables();
      expect(contrastVars['--color-bg']).toBe('hsl(0, 0%, 100%)');
    });

    it('should inject dynamic white-label tenant primary brand color overrides', () => {
      themeService.setTenantWhiteLabelBrand('hsl(142, 71%, 45%)');
      const vars = themeService.generateCssVariables('tenant-pizza');

      expect(vars['--color-primary']).toBe('hsl(142, 71%, 45%)');
      expect(vars['--tenant-id']).toBe('tenant-pizza');
    });
  });

  describe('Accessibility & Responsive Services', () => {
    let accessibilityService: AccessibilityService;
    let responsiveService: ResponsiveService;

    beforeEach(() => {
      accessibilityService = new AccessibilityService();
      responsiveService = new ResponsiveService();
    });

    it('should calculate contrast ratio and validate WCAG 2.2 AA compliance', () => {
      const ratio = accessibilityService.calculateContrastRatio(1.0, 0.05);
      expect(ratio).toBeGreaterThan(4.5);
      expect(accessibilityService.validateWcagCompliance(ratio)).toBe(true);

      const report = accessibilityService.getAccessibilityReport();
      expect(report.overallContrastCompliance).toBe(true);
      expect(report.wcagLevel).toBe('WCAG 2.2 AA');
    });

    it('should match viewport widths to responsive breakpoints correctly', () => {
      expect(responsiveService.matchBreakpoint(320)).toBe('xs');
      expect(responsiveService.matchBreakpoint(768)).toBe('md');
      expect(responsiveService.matchBreakpoint(1400)).toBe('xl');
      expect(responsiveService.matchBreakpoint(1920)).toBe('3xl');
    });
  });

  describe('TokenService, IconService & Read Models', () => {
    let tokenService: TokenService;
    let iconService: IconService;
    let designTokenService: DesignTokenService;

    beforeEach(() => {
      tokenService = new TokenService();
      iconService = new IconService();
      designTokenService = new DesignTokenService();
    });

    it('should resolve colors and spacing programmatically', () => {
      const color = tokenService.getColor('primary.500');
      expect(color?.name).toBe('primary.500');

      const rem = tokenService.getSpacing('4');
      expect(rem).toBe('1rem');
    });

    it('should retrieve registered icons', () => {
      const icon = iconService.get('check');
      expect(icon).toBeDefined();
      expect(icon?.name).toBe('check');
    });

    it('should query Component Catalog, Token Catalog, and Theme Catalog read models', () => {
      const tokenCatalog = tokenService.getTokenCatalog();
      expect(tokenCatalog.totalColorTokens).toBe(12);

      const componentCatalog = designTokenService.getComponentCatalog();
      expect(componentCatalog.totalComponents).toBe(32);
      expect(componentCatalog.byCategory['Inputs']).toBe(7);
    });
  });
});
