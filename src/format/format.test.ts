import { describe, it, expect } from 'vitest';
import { formatMoneyMinor } from './money.js';
import { relativeParts, formatAbsoluteDate } from './time.js';
import { formatScopeLimit, scopeDisplayName, isBehaviouralScopeId } from './scopes.js';
import { createTranslator } from '../i18n/index.js';
import type { AuthorityScope, OauthScope } from '../types.js';

describe('formatMoneyMinor', () => {
  it('renders whole shilling amounts without decimals + thousands groups', () => {
    expect(formatMoneyMinor(250000)).toBe('KES 2,500');
    expect(formatMoneyMinor(5000000)).toBe('KES 50,000');
    expect(formatMoneyMinor(3000)).toBe('KES 30');
    expect(formatMoneyMinor(0)).toBe('KES 0');
  });

  it('keeps two decimals for fractional amounts', () => {
    expect(formatMoneyMinor(250050)).toBe('KES 2,500.50');
    expect(formatMoneyMinor(105)).toBe('KES 1.05');
  });

  it('handles negative amounts', () => {
    expect(formatMoneyMinor(-12345)).toBe('-KES 123.45');
  });
});

describe('relativeParts', () => {
  const now = new Date('2026-05-18T12:00:00.000Z');

  it('returns null for missing / unparseable input', () => {
    expect(relativeParts(null, now)).toBeNull();
    expect(relativeParts(undefined, now)).toBeNull();
    expect(relativeParts('not-a-date', now)).toBeNull();
  });

  it('reads near-now as "now"', () => {
    expect(relativeParts('2026-05-18T12:00:10.000Z', now)?.direction).toBe('now');
  });

  it('decomposes past minutes / hours / days', () => {
    expect(relativeParts('2026-05-18T11:55:00.000Z', now)).toEqual({
      direction: 'past',
      unit: 'minute',
      value: 5,
    });
    expect(relativeParts('2026-05-18T09:00:00.000Z', now)).toEqual({
      direction: 'past',
      unit: 'hour',
      value: 3,
    });
    expect(relativeParts('2026-05-15T12:00:00.000Z', now)).toEqual({
      direction: 'past',
      unit: 'day',
      value: 3,
    });
  });

  it('decomposes future times (e.g. "expires in 3 days")', () => {
    expect(relativeParts('2026-05-21T12:00:00.000Z', now)).toEqual({
      direction: 'future',
      unit: 'day',
      value: 3,
    });
  });
});

describe('formatAbsoluteDate', () => {
  it('formats an ISO date', () => {
    expect(formatAbsoluteDate('2026-05-18T12:00:00.000Z')).toBe('18 May 2026');
  });
  it('returns empty for missing input', () => {
    expect(formatAbsoluteDate(null)).toBe('');
  });
});

describe('scope formatting', () => {
  const t = createTranslator('en');
  const moneyScope: AuthorityScope = {
    scope_id: 'kipkiren.write.payments',
    amount_limit_minor: 250000,
    period: 'weekly',
  };
  const readScope: AuthorityScope = { scope_id: 'helpan.read.briefings' };

  it('formats a money scope limit', () => {
    expect(formatScopeLimit(moneyScope, t)).toBe('Up to KES 2,500 per week');
  });

  it('returns empty for a scope with no money limit', () => {
    expect(formatScopeLimit(readScope, t)).toBe('');
  });

  it('localises the period word in Swahili', () => {
    expect(formatScopeLimit(moneyScope, createTranslator('sw'))).toBe('Hadi KES 2,500 kwa wiki');
  });

  it('uses the catalogue name when available, else the scope_id', () => {
    const cat = new Map<string, OauthScope>([
      [
        'helpan.read.briefings',
        {
          id: 'helpan.read.briefings',
          name: 'Read briefings',
          description: 'x',
          rail: 'helpan',
          category: 'read_aggregate',
          default_grantable: true,
          elevation_friction: 'low',
          per_scope_max_ttl_seconds: 86400,
          status: 'active',
        },
      ],
    ]);
    expect(scopeDisplayName(readScope, cat)).toBe('Read briefings');
    expect(scopeDisplayName(moneyScope, cat)).toBe('kipkiren.write.payments');
    expect(scopeDisplayName(readScope)).toBe('helpan.read.briefings');
  });

  it('flags behavioural scopes from the catalogue', () => {
    const cat = new Map<string, OauthScope>([
      [
        'chapaa.read.behavioural',
        {
          id: 'chapaa.read.behavioural',
          name: 'Behavioural',
          description: 'x',
          rail: 'chapaa',
          category: 'read_behavioural',
          default_grantable: false,
          elevation_friction: 'high',
          per_scope_max_ttl_seconds: 900,
          status: 'active',
        },
      ],
    ]);
    expect(isBehaviouralScopeId('chapaa.read.behavioural', cat)).toBe(true);
    expect(isBehaviouralScopeId('helpan.read.briefings', cat)).toBe(false);
  });
});
