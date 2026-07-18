"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTheme = void 0;
exports.resolveTheme = resolveTheme;
/**
 * Helpan Console design tokens.
 *
 * Per spec §8 ("no hardcoded values — design tokens only") the consuming
 * app injects brand colour + typography via a `theme` prop; everything
 * structural (spacing, radii, type scale) and every *semantic* role is
 * fixed by the library. `resolveTheme` merges a consumer's partial onto the
 * defaults — a consumer can rebrand `primary` / `accent` / `danger` but the
 * Console always paints revocation with `colors.danger`, so the consent
 * semantics survive any rebrand.
 */

/**
 * The partial a consuming app may pass to `HelpanConsole.open({ theme })`.
 * Only the brand-facing knobs are exposed; structural tokens are not
 * overridable.
 */

const defaultTheme = exports.defaultTheme = {
  colors: {
    primary: '#0D5C4E',
    accent: '#C47A1A',
    danger: '#8B1A1A',
    success: '#1F7A4D',
    warning: '#B8860B',
    background: '#F7F7F5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#6B6B6B',
    border: '#E2E2DE',
    onPrimary: '#FFFFFF',
    onDanger: '#FFFFFF'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 20
  },
  typography: {
    fontFamily: 'System',
    caption: 12,
    body: 15,
    title: 18,
    heading: 24
  }
};

/**
 * Merge a consumer's brand partial onto the defaults. Returns a fresh,
 * fully-populated `ConsoleTheme`; the defaults object is never mutated.
 */
function resolveTheme(input) {
  return {
    colors: {
      ...defaultTheme.colors,
      ...(input?.primary ? {
        primary: input.primary
      } : {}),
      ...(input?.accent ? {
        accent: input.accent
      } : {}),
      ...(input?.danger ? {
        danger: input.danger
      } : {})
    },
    spacing: {
      ...defaultTheme.spacing
    },
    radius: {
      ...defaultTheme.radius
    },
    typography: {
      ...defaultTheme.typography,
      ...(input?.fontFamily ? {
        fontFamily: input.fontFamily
      } : {})
    }
  };
}
//# sourceMappingURL=tokens.js.map