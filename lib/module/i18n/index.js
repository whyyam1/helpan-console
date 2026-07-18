"use strict";

/**
 * Translator for the Helpan Console.
 *
 * `createTranslator(lang)` returns a `t(key, params?)` function. Unknown
 * languages fall back to English; `{param}` placeholders are substituted
 * from `params`. A missing key returns the key itself (loud in dev, never
 * a crash).
 */

import { STRINGS } from './strings.js';
function interpolate(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name) => Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : whole);
}
export function isSupportedLang(value) {
  return value === 'en' || value === 'sw';
}
export function createTranslator(lang) {
  const table = isSupportedLang(lang) ? STRINGS[lang] : STRINGS.en;
  return (key, params) => {
    const template = table[key] ?? STRINGS.en[key] ?? key;
    return interpolate(template, params);
  };
}
//# sourceMappingURL=index.js.map