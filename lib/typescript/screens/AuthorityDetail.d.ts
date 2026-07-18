/**
 * Authority detail screen (spec §3.3).
 *
 * Full authority view (AuthorityCard variant) + recent actions filtered
 * to this authority's jti. The Revoke action lives at the bottom under
 * the actions list so the user reads what the agent has done before
 * tapping revoke.
 *
 * Step-up isn't shown explicitly (spec §3.3 mentions step_up_token JTI as
 * "informational, audit-friendly" — kept off the v1.0 surface).
 */
import React from 'react';
import type { Authority, ConsoleAction, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface AuthorityDetailProps {
    readonly theme: ConsoleTheme;
    readonly t: Translator;
    readonly lang: 'en' | 'sw';
    readonly authority: Authority;
    readonly catalogue?: ReadonlyMap<string, OauthScope>;
    /** All known actions; will be filtered to this authority's jti. */
    readonly actions: readonly ConsoleAction[];
    readonly isRevoking?: boolean;
    readonly onRevoke?: () => void;
    /** Cap on rows shown — spec §3.2 says "last 30". Default 30. */
    readonly maxActions?: number;
}
export declare function AuthorityDetail(props: AuthorityDetailProps): React.JSX.Element;
//# sourceMappingURL=AuthorityDetail.d.ts.map