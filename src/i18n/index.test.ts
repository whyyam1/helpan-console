import { describe, it, expect } from 'vitest';
import { createTranslator, isSupportedLang } from './index.js';
import { EN, SW } from './strings.js';

describe('createTranslator', () => {
  it('translates a key in English', () => {
    const t = createTranslator('en');
    expect(t('tab.active')).toBe('Active');
  });

  it('translates a key in Swahili', () => {
    const t = createTranslator('sw');
    expect(t('tab.active')).toBe('Hai');
    expect(t('action.revoke')).toBe('Batilisha');
  });

  it('falls back to English for an unsupported language', () => {
    const t = createTranslator('fr');
    expect(t('tab.history')).toBe('History');
  });

  it('interpolates {param} placeholders', () => {
    const t = createTranslator('en');
    expect(t('scope.limit', { amount: 'KES 2,500', period: 'per week' })).toBe(
      'Up to KES 2,500 per week'
    );
  });

  it('leaves an unmatched placeholder intact', () => {
    const t = createTranslator('en');
    expect(t('scope.limit', { amount: 'KES 10' })).toBe('Up to KES 10 {period}');
  });

  it('every English key has a Swahili translation (no gaps)', () => {
    for (const key of Object.keys(EN)) {
      expect(SW[key as keyof typeof EN], `missing sw: ${key}`).toBeTruthy();
    }
  });

  it('isSupportedLang gates en/sw only', () => {
    expect(isSupportedLang('en')).toBe(true);
    expect(isSupportedLang('sw')).toBe(true);
    expect(isSupportedLang('de')).toBe(false);
  });
});
