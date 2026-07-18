/**
 * Relative-time decomposition for the Console (spec §3.2 — "Granted: relative
 * + absolute", "Last used: 5 minutes ago or never").
 *
 * `relativeParts` is pure and language-agnostic — it returns the structured
 * pieces (direction · unit · value); the component layer assembles the
 * localised string from those pieces + the i18n catalogue. Splitting it
 * this way keeps the bug-prone arithmetic unit-testable without i18n.
 */
export type RelativeDirection = 'past' | 'future' | 'now';
export type RelativeUnit = 'minute' | 'hour' | 'day';
export interface RelativeParts {
    direction: RelativeDirection;
    unit: RelativeUnit;
    /** Whole-number magnitude in `unit`. Zero only when `direction === 'now'`. */
    value: number;
}
/**
 * Decompose the gap between `iso` and `now` into a coarse relative
 * descriptor. Returns `null` when `iso` is absent or unparseable (the
 * caller renders "never").
 */
export declare function relativeParts(iso: string | null | undefined, now?: Date): RelativeParts | null;
/**
 * Localised relative-time string, assembled from `relativeParts` + the
 * translator. Picks the right i18n key by direction × unit × singular/plural.
 * Returns an empty string for null parts so the caller can decide between
 * "never" and an absolute date.
 */
import type { Translator } from '../i18n/index.js';
export declare function formatRelative(parts: RelativeParts | null, t: Translator): string;
/** Absolute calendar date, e.g. `"18 May 2026"`. */
export declare function formatAbsoluteDate(iso: string | null | undefined): string;
//# sourceMappingURL=time.d.ts.map