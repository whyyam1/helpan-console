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
export interface ConsoleColors {
    /** Brand primary — buttons, active tab. Overridable. */
    primary: string;
    /** Brand accent — secondary highlights. Overridable. */
    accent: string;
    /** Revoke / destructive. Overridable hue, fixed semantic role. */
    danger: string;
    /** Completed / healthy. */
    success: string;
    /** Pending / caution. */
    warning: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    /** On-primary text (for buttons). */
    onPrimary: string;
    /** On-danger text. */
    onDanger: string;
}
export interface ConsoleSpacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}
export interface ConsoleRadius {
    sm: number;
    md: number;
    lg: number;
}
export interface ConsoleTypography {
    fontFamily: string;
    caption: number;
    body: number;
    title: number;
    heading: number;
}
export interface ConsoleTheme {
    colors: ConsoleColors;
    spacing: ConsoleSpacing;
    radius: ConsoleRadius;
    typography: ConsoleTypography;
}
/**
 * The partial a consuming app may pass to `HelpanConsole.open({ theme })`.
 * Only the brand-facing knobs are exposed; structural tokens are not
 * overridable.
 */
export interface ConsoleThemeInput {
    primary?: string;
    accent?: string;
    danger?: string;
    fontFamily?: string;
}
export declare const defaultTheme: ConsoleTheme;
/**
 * Merge a consumer's brand partial onto the defaults. Returns a fresh,
 * fully-populated `ConsoleTheme`; the defaults object is never mutated.
 */
export declare function resolveTheme(input?: ConsoleThemeInput): ConsoleTheme;
//# sourceMappingURL=tokens.d.ts.map