/**
 * History tab — revoked / expired authorities (spec §3.5).
 *
 * Same `AuthorityCard` component as Active, but rendered with
 * `hideActions=true` and a reason chip below the status pill ("You revoked
 * this" / "Expired" / "Revoked because your account was suspended"). The
 * reason copy comes from the i18n catalogue keyed on
 * `authority.revocation_reason`, with `expired` as a synthetic fallback
 * when `status='expired'` and there's no explicit reason.
 */
import React from 'react';
import type { Authority, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface HistoryTabProps {
    readonly theme: ConsoleTheme;
    readonly t: Translator;
    readonly lang: 'en' | 'sw';
    readonly authorities: readonly Authority[];
    readonly catalogue?: ReadonlyMap<string, OauthScope>;
    readonly refreshing?: boolean;
    readonly onRefresh?: () => void;
}
export declare function HistoryTab(props: HistoryTabProps): React.JSX.Element;
//# sourceMappingURL=HistoryTab.d.ts.map