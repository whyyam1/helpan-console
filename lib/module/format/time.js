"use strict";

/**
 * Relative-time decomposition for the Console (spec §3.2 — "Granted: relative
 * + absolute", "Last used: 5 minutes ago or never").
 *
 * `relativeParts` is pure and language-agnostic — it returns the structured
 * pieces (direction · unit · value); the component layer assembles the
 * localised string from those pieces + the i18n catalogue. Splitting it
 * this way keeps the bug-prone arithmetic unit-testable without i18n.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const NOW_THRESHOLD = 45_000; // within 45s either side reads as "just now"

/**
 * Decompose the gap between `iso` and `now` into a coarse relative
 * descriptor. Returns `null` when `iso` is absent or unparseable (the
 * caller renders "never").
 */
export function relativeParts(iso, now = new Date()) {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return null;
  const deltaMs = then - now.getTime();
  const abs = Math.abs(deltaMs);
  if (abs < NOW_THRESHOLD) return {
    direction: 'now',
    unit: 'minute',
    value: 0
  };
  const direction = deltaMs < 0 ? 'past' : 'future';
  if (abs < HOUR) {
    return {
      direction,
      unit: 'minute',
      value: Math.max(1, Math.round(abs / MINUTE))
    };
  }
  if (abs < DAY) {
    return {
      direction,
      unit: 'hour',
      value: Math.max(1, Math.round(abs / HOUR))
    };
  }
  return {
    direction,
    unit: 'day',
    value: Math.max(1, Math.round(abs / DAY))
  };
}

/**
 * Localised relative-time string, assembled from `relativeParts` + the
 * translator. Picks the right i18n key by direction × unit × singular/plural.
 * Returns an empty string for null parts so the caller can decide between
 * "never" and an absolute date.
 */

export function formatRelative(parts, t) {
  if (!parts) return '';
  if (parts.direction === 'now') return t('time.now');
  const plural = parts.value === 1 ? '' : 's';
  const key = `time.${parts.direction}.${parts.unit}${plural}`;
  return t(key, {
    n: String(parts.value)
  });
}

/** Absolute calendar date, e.g. `"18 May 2026"`. */
export function formatAbsoluteDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
//# sourceMappingURL=time.js.map