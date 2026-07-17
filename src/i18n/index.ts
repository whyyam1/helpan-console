/**
 * Translator for the Helpan Console.
 *
 * `createTranslator(lang)` returns a `t(key, params?)` function. Unknown
 * languages fall back to English; `{param}` placeholders are substituted
 * from `params`. A missing key returns the key itself (loud in dev, never
 * a crash).
 */

import { STRINGS, type Lang, type MessageKey } from './strings.js';

export type { Lang, MessageKey } from './strings.js';

export type TranslateParams = Record<string, string | number>;
export type Translator = (key: MessageKey, params?: TranslateParams) => string;

function interpolate(template: string, params?: TranslateParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : whole
  );
}

export function isSupportedLang(value: string): value is Lang {
  return value === 'en' || value === 'sw';
}

export function createTranslator(lang: string): Translator {
  const table = isSupportedLang(lang) ? STRINGS[lang] : STRINGS.en;
  return (key, params) => {
    const template = table[key] ?? STRINGS.en[key] ?? key;
    return interpolate(template, params);
  };
}
