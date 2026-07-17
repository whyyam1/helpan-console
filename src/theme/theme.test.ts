import { describe, it, expect } from 'vitest';
import { defaultTheme, resolveTheme } from './tokens.js';

describe('resolveTheme', () => {
  it('returns the defaults when no input is given', () => {
    const t = resolveTheme();
    expect(t.colors.primary).toBe(defaultTheme.colors.primary);
    expect(t.spacing.md).toBe(16);
  });

  it('overrides brand colours from the consumer partial', () => {
    const t = resolveTheme({ primary: '#112233', accent: '#445566', danger: '#778899' });
    expect(t.colors.primary).toBe('#112233');
    expect(t.colors.accent).toBe('#445566');
    expect(t.colors.danger).toBe('#778899');
  });

  it('keeps structural tokens non-overridable (spacing/radius/type scale fixed)', () => {
    const t = resolveTheme({ primary: '#000000' });
    expect(t.spacing).toEqual(defaultTheme.spacing);
    expect(t.radius).toEqual(defaultTheme.radius);
    expect(t.typography.body).toBe(defaultTheme.typography.body);
  });

  it('overrides fontFamily but leaves the type scale intact', () => {
    const t = resolveTheme({ fontFamily: 'Inter' });
    expect(t.typography.fontFamily).toBe('Inter');
    expect(t.typography.heading).toBe(defaultTheme.typography.heading);
  });

  it('does not mutate the shared defaults object', () => {
    resolveTheme({ primary: '#FF0000' });
    expect(defaultTheme.colors.primary).toBe('#0D5C4E');
  });

  it('preserves semantic colours (success/warning/onDanger) on a rebrand', () => {
    const t = resolveTheme({ primary: '#FF0000' });
    expect(t.colors.success).toBe(defaultTheme.colors.success);
    expect(t.colors.onDanger).toBe(defaultTheme.colors.onDanger);
  });
});
