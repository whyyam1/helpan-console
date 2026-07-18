/**
 * Active tab screen — list of active authorities (spec §3.1).
 *
 * Renders a `ScrollView` of `AuthorityCard`s, one per active authority
 * grouped by recency (most recently granted first). Pull-to-refresh and
 * pagination-on-scroll are wired via `RefreshControl` and a near-end
 * detector; both bind to the `useConsoleData` actions surface.
 *
 * Navigation: when the user taps a card (anywhere outside the action
 * buttons) we call `onAuthorityPress` with the row; the parent decides
 * whether to open the AuthorityDetail screen. The revoke + view-activity
 * callbacks dispatch separately so tab orchestration can route them
 * differently (e.g. revoke might open a confirm modal at the parent level).
 */
import React from 'react';
import type { Authority, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface ActiveTabProps {
    readonly theme: ConsoleTheme;
    readonly t: Translator;
    readonly lang: 'en' | 'sw';
    readonly authorities: readonly Authority[];
    readonly catalogue?: ReadonlyMap<string, OauthScope>;
    readonly refreshing?: boolean;
    readonly hasMore?: boolean;
    readonly onRefresh?: () => void;
    readonly onLoadMore?: () => void;
    readonly onAuthorityPress?: (authority: Authority) => void;
    readonly onRevoke?: (authority: Authority) => void;
    readonly onViewActivity?: (authority: Authority) => void;
}
export declare function ActiveTab(props: ActiveTabProps): React.JSX.Element;
//# sourceMappingURL=ActiveTab.d.ts.map