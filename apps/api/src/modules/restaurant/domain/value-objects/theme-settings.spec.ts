import { test, describe, it } from 'node:test';
import * as assert from 'node:assert';
import { ColorPalette } from './color-palette.value-object';
import { Typography } from './typography.value-object';
import { BrandAssets } from './brand-assets.value-object';
import { ThemeSettings } from './theme-settings.value-object';

describe('ThemeSettings Value Objects', () => {
  describe('ColorPalette', () => {
    it('should create a valid color palette', () => {
      const palette = new ColorPalette('#FFF', '#000000', '#F00', '#FFF', '#FFF', '#333', '#0F0', '#FF0', '#F00');
      assert.strictEqual(palette.primary, '#FFF');
    });

    it('should throw on invalid hex color', () => {
      assert.throws(() => {
        new ColorPalette('FFF', '#000000', '#F00', '#FFF', '#FFF', '#333', '#0F0', '#FF0', '#F00');
      });
      assert.throws(() => {
        new ColorPalette('#FFFF', '#000000', '#F00', '#FFF', '#FFF', '#333', '#0F0', '#FF0', '#F00');
      });
      assert.throws(() => {
        new ColorPalette('#ZZZ', '#000000', '#F00', '#FFF', '#FFF', '#333', '#0F0', '#FF0', '#F00');
      });
    });
  });

  describe('Typography', () => {
    it('should create valid typography', () => {
      const typo = new Typography('Inter, sans-serif', 'Roboto', 1.2, 1.0);
      assert.strictEqual(typo.primaryFont, 'Inter, sans-serif');
    });

    it('should throw on invalid font name', () => {
      assert.throws(() => new Typography('', 'Roboto', 1.2, 1.0));
      assert.throws(() => new Typography('Inter<script>', 'Roboto', 1.2, 1.0));
    });

    it('should throw on invalid scale', () => {
      assert.throws(() => new Typography('Inter', 'Roboto', 0, 1.0));
      assert.throws(() => new Typography('Inter', 'Roboto', 1.2, 6.0));
    });
  });

  describe('BrandAssets', () => {
    it('should create valid brand assets', () => {
      const assets = new BrandAssets(
        'https://example.com/logo.png',
        'https://example.com/dark-logo.png',
        'https://example.com/favicon.ico',
        'https://example.com/cover.jpg'
      );
      assert.strictEqual(assets.logo, 'https://example.com/logo.png');
    });

    it('should throw on invalid URL', () => {
      assert.throws(() => new BrandAssets(
        'not-a-url',
        'https://example.com/dark-logo.png',
        'https://example.com/favicon.ico',
        'https://example.com/cover.jpg'
      ));
    });
  });

  describe('ThemeSettings', () => {
    it('should create valid ThemeSettings', () => {
      const colors = new ColorPalette('#FFF', '#000', '#F00', '#FFF', '#FFF', '#333', '#0F0', '#FF0', '#F00');
      const typography = new Typography('Inter', 'Roboto', 1.2, 1.0);
      const assets = new BrandAssets('http://logo.com', 'http://logo.com', 'http://logo.com', 'http://logo.com');
      
      const theme = new ThemeSettings(colors, typography, assets, 8, 'solid', 'flat', true, true);
      assert.strictEqual(theme.borderRadius, 8);
    });

    it('should throw on invalid border radius', () => {
      const colors = new ColorPalette('#FFF', '#000', '#F00', '#FFF', '#FFF', '#333', '#0F0', '#FF0', '#F00');
      const typography = new Typography('Inter', 'Roboto', 1.2, 1.0);
      const assets = new BrandAssets('http://logo.com', 'http://logo.com', 'http://logo.com', 'http://logo.com');
      
      assert.throws(() => new ThemeSettings(colors, typography, assets, -1, 'solid', 'flat', true, true));
      assert.throws(() => new ThemeSettings(colors, typography, assets, 100, 'solid', 'flat', true, true));
    });
  });
});
