/**
 * Console scope list — used inside `AuthorityCard` and on the authority
 * detail screen (spec §3.2 / §3.3).
 *
 * Each row renders:
 *   • bullet · scope display name
 *           (and below, in muted text, the limit clause when present)
 *
 * Behavioural-data scopes get a small amber pill — same visual we used in
 * the HTML investor demo. The pill is the Console's standing visual cue
 * that the scope crossed the §4.2 friction screen at grant time.
 */
import React from 'react';
import type { AuthorityScope, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface ScopeListProps {
    readonly theme: ConsoleTheme;
    readonly t: Translator;
    readonly scopes: readonly AuthorityScope[];
    readonly catalogue?: ReadonlyMap<string, OauthScope>;
}
export declare function ScopeList(props: ScopeListProps): React.JSX.Element;
//# sourceMappingURL=ScopeList.d.ts.map