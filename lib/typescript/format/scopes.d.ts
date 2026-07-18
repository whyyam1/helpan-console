/**
 * Human-readable scope rendering for the Console authority card + detail
 * (spec §3.2 / §3.3 — "each scope shows scope name + amount/period limit",
 * "Up to KES 2,500 per shift").
 */
import type { AuthorityScope, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
/**
 * Display name for a scope. Uses the catalogue `name` when the scope
 * metadata is loaded; otherwise falls back to the raw `scope_id` so the
 * card still renders something meaningful offline / before the catalogue
 * fetch resolves.
 */
export declare function scopeDisplayName(scope: AuthorityScope, catalogue?: ReadonlyMap<string, OauthScope>): string;
/**
 * The limit clause for a scope, e.g. `"Up to KES 2,500 per week"`. Returns
 * `''` for a scope with no money limit (a read-only scope) — the caller
 * shows the name alone.
 */
export declare function formatScopeLimit(scope: AuthorityScope, t: Translator): string;
/**
 * Whether a scope, as resolved against the catalogue, is a behavioural-data
 * scope — the Console gates these behind the friction screen (spec §4.2).
 */
export declare function isBehaviouralScopeId(scopeId: string, catalogue?: ReadonlyMap<string, OauthScope>): boolean;
//# sourceMappingURL=scopes.d.ts.map