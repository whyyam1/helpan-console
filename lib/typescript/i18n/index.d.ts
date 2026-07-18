/**
 * Translator for the Helpan Console.
 *
 * `createTranslator(lang)` returns a `t(key, params?)` function. Unknown
 * languages fall back to English; `{param}` placeholders are substituted
 * from `params`. A missing key returns the key itself (loud in dev, never
 * a crash).
 */
import { type Lang, type MessageKey } from './strings.js';
export type { Lang, MessageKey } from './strings.js';
export type TranslateParams = Record<string, string | number>;
export type Translator = (key: MessageKey, params?: TranslateParams) => string;
export declare function isSupportedLang(value: string): value is Lang;
export declare function createTranslator(lang: string): Translator;
//# sourceMappingURL=index.d.ts.map