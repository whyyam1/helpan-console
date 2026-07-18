/**
 * Console authority card (spec §3.2).
 *
 * One card per authority on the Active tab; same component is reused on
 * the AuthorityDetail screen with `compact={false}` to render the larger
 * variant.
 *
 * Fields (spec §3.2):
 *   • Agent name + small status pill (Active / Expired / Revoked)
 *   • Granted on / Expires / Last used — three columns of meta
 *   • ScopeList — the human-readable scope rows
 *   • Quick actions: Revoke (danger semantics) + View activity
 *
 * The Revoke button is ALWAYS danger-coloured regardless of theme rebrand
 * (spec §8 semantic invariant). The View activity button uses the muted
 * neutral background — secondary affordance.
 */
import React from 'react';
import type { Authority, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface AuthorityCardProps {
    readonly theme: ConsoleTheme;
    readonly t: Translator;
    readonly lang: 'en' | 'sw';
    readonly authority: Authority;
    readonly catalogue?: ReadonlyMap<string, OauthScope>;
    readonly lastUsedAt?: string | null;
    readonly onRevoke?: () => void;
    readonly onViewActivity?: () => void;
    /**
     * Hide the action footer (Revoke / View activity). Used on the History
     * tab where the authority already ended.
     */
    readonly hideActions?: boolean;
}
export declare function AuthorityCard(props: AuthorityCardProps): React.JSX.Element;
//# sourceMappingURL=AuthorityCard.d.ts.map