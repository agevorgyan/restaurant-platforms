import { describe, it, expect } from 'vitest';
import { generateThemeCss } from '../utils/css-generator';
import { defaultTheme } from '../default-theme';

describe('css-generator', () => {
  it('should generate valid CSS string for the default theme', () => {
    const css = generateThemeCss(defaultTheme);
    
    // Check root and light colors
    expect(css).toContain(':root {');
    expect(css).toContain('--primary: 240 5.9% 10%;');
    expect(css).toContain('--primary-foreground: 0 0% 98%;');
    expect(css).toContain('--radius: 0.5rem;');
    
    // Check dark colors
    expect(css).toContain('.dark {');
    expect(css).toContain('--primary: 0 0% 98%;');
    expect(css).toContain('--primary-foreground: 240 5.9% 10%;');
  });
});
