"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTranslator = createTranslator;
exports.isSupportedLang = isSupportedLang;
var _strings = require("./strings.js");
/**
 * Translator for the Helpan Console.
 *
 * `createTranslator(lang)` returns a `t(key, params?)` function. Unknown
 * languages fall back to English; `{param}` placeholders are substituted
 * from `params`. A missing key returns the key itself (loud in dev, never
 * a crash).
 */

function interpolate(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name) => Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : whole);
}
function isSupportedLang(value) {
  return value === 'en' || value === 'sw';
}
function createTranslator(lang) {
  const table = isSupportedLang(lang) ? _strings.STRINGS[lang] : _strings.STRINGS.en;
  return (key, params) => {
    const template = table[key] ?? _strings.STRINGS.en[key] ?? key;
    return interpolate(template, params);
  };
}
//# sourceMappingURL=index.js.map