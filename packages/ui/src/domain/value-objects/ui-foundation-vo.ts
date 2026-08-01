/**
 * Enterprise Design System - Value Objects
 *
 * Immutable Value Objects encapsulating theme IDs, color tokens, typography tokens,
 * spacing scale, elevation/shadows, breakpoint queries, component variants, responsive rules, and icon definitions.
 */

import { ThemeMode } from '../enums/ui-foundation.enums';

/**
 * ThemeId Value Object
 */
export class ThemeId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ThemeId cannot be empty');
    }
    this.value = value;
  }

  public static create(id?: string): ThemeId {
    return new ThemeId(id || `theme-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
  }

  public getValue(): string {
    return this.value;
  }
}

/**
 * ColorToken Value Object
 */
export class ColorToken {
  public readonly name: string;
  public readonly hexOrHsl: string;
  public readonly cssVariable: string;

  private constructor(name: string, hexOrHsl: string, cssVariable?: string) {
    this.name = name;
    this.hexOrHsl = hexOrHsl;
    this.cssVariable = cssVariable || `--color-${name.replace(/\./g, '-')}`;
  }

  public static create(name: string, hexOrHsl: string, cssVariable?: string): ColorToken {
    return new ColorToken(name, hexOrHsl, cssVariable);
  }
}

/**
 * TypographyToken Value Object
 */
export class TypographyToken {
  public readonly fontFamily: string;
  public readonly fontSize: string;
  public readonly lineHeight: string;
  public readonly fontWeight: number;
  public readonly letterSpacing: string;

  private constructor(props: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: number;
    letterSpacing?: string;
  }) {
    this.fontFamily = props.fontFamily;
    this.fontSize = props.fontSize;
    this.lineHeight = props.lineHeight;
    this.fontWeight = props.fontWeight;
    this.letterSpacing = props.letterSpacing || 'normal';
  }

  public static create(props: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: number;
    letterSpacing?: string;
  }): TypographyToken {
    return new TypographyToken(props);
  }
}

/**
 * SpacingToken Value Object
 */
export class SpacingToken {
  public readonly key: string;
  public readonly pxValue: number;
  public readonly remValue: string;

  private constructor(key: string, pxValue: number) {
    this.key = key;
    this.pxValue = pxValue;
    this.remValue = `${pxValue / 16}rem`;
  }

  public static create(key: string, pxValue: number): SpacingToken {
    return new SpacingToken(key, pxValue);
  }
}

/**
 * ElevationToken Value Object
 */
export class ElevationToken {
  public readonly level: string;
  public readonly boxShadow: string;

  private constructor(level: string, boxShadow: string) {
    this.level = level;
    this.boxShadow = boxShadow;
  }

  public static create(level: string, boxShadow: string): ElevationToken {
    return new ElevationToken(level, boxShadow);
  }
}

/**
 * Breakpoint Value Object
 */
export class Breakpoint {
  public readonly name: string;
  public readonly minWidthPx: number;

  private constructor(name: string, minWidthPx: number) {
    this.name = name;
    this.minWidthPx = minWidthPx;
  }

  public static create(name: string, minWidthPx: number): Breakpoint {
    return new Breakpoint(name, minWidthPx);
  }

  public get mediaQuery(): string {
    return `(min-width: ${this.minWidthPx}px)`;
  }
}

/**
 * ComponentVariant Value Object
 */
export class ComponentVariant {
  public readonly variantName: string;
  public readonly classes: string[];
  public readonly props: Record<string, unknown>;

  private constructor(variantName: string, classes: string[], props?: Record<string, unknown>) {
    this.variantName = variantName;
    this.classes = classes;
    this.props = props || {};
  }

  public static create(variantName: string, classes: string[], props?: Record<string, unknown>): ComponentVariant {
    return new ComponentVariant(variantName, classes, props);
  }
}

/**
 * ResponsiveRule Value Object
 */
export class ResponsiveRule {
  public readonly breakpointName: string;
  public readonly styleOverrides: Record<string, string>;

  private constructor(breakpointName: string, styleOverrides: Record<string, string>) {
    this.breakpointName = breakpointName;
    this.styleOverrides = styleOverrides;
  }

  public static create(breakpointName: string, styleOverrides: Record<string, string>): ResponsiveRule {
    return new ResponsiveRule(breakpointName, styleOverrides);
  }
}

/**
 * IconDefinition Value Object
 */
export class IconDefinition {
  public readonly name: string;
  public readonly viewBox: string;
  public readonly svgPath: string;

  private constructor(name: string, viewBox: string = '0 0 24 24', svgPath: string = '') {
    this.name = name;
    this.viewBox = viewBox;
    this.svgPath = svgPath;
  }

  public static create(name: string, viewBox?: string, svgPath?: string): IconDefinition {
    return new IconDefinition(name, viewBox, svgPath);
  }
}
