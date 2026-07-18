"use strict";

/**
 * Human-readable scope rendering for the Console authority card + detail
 * (spec §3.2 / §3.3 — "each scope shows scope name + amount/period limit",
 * "Up to KES 2,500 per shift").
 */

import { formatMoneyMinor } from './money.js';
const PERIOD_KEY = {
  single_use: 'period.single_use',
  daily: 'period.daily',
  weekly: 'period.weekly',
  monthly: 'period.monthly'
};

/**
 * Display name for a scope. Uses the catalogue `name` when the scope
 * metadata is loaded; otherwise falls back to the raw `scope_id` so the
 * card still renders something meaningful offline / before the catalogue
 * fetch resolves.
 */
export function scopeDisplayName(scope, catalogue) {
  return catalogue?.get(scope.scope_id)?.name ?? scope.scope_id;
}

/**
 * The limit clause for a scope, e.g. `"Up to KES 2,500 per week"`. Returns
 * `''` for a scope with no money limit (a read-only scope) — the caller
 * shows the name alone.
 */
export function formatScopeLimit(scope, t) {
  if (scope.amount_limit_minor === undefined) return '';
  const amount = formatMoneyMinor(scope.amount_limit_minor);
  const period = scope.period ? t(PERIOD_KEY[scope.period]) : '';
  return t('scope.limit', {
    amount,
    period
  }).trimEnd();
}

/**
 * Whether a scope, as resolved against the catalogue, is a behavioural-data
 * scope — the Console gates these behind the friction screen (spec §4.2).
 */
export function isBehaviouralScopeId(scopeId, catalogue) {
  return catalogue?.get(scopeId)?.category === 'read_behavioural';
}
//# sourceMappingURL=scopes.js.map