/**
 * Activity tab — agent action log (spec §3.4).
 *
 * Reverse-chronological list. Each row shows agent + operation + status +
 * timestamp. Failed actions surface the error_code below the title in
 * muted text. The list is loaded lazily — the parent calls
 * `actions.loadActivity()` the first time this tab is opened (the hook
 * does not auto-load on mount, by design).
 */
import React from 'react';
import type { ConsoleAction } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface ActivityTabProps {
    readonly theme: ConsoleTheme;
    readonly t: Translator;
    readonly actions: readonly ConsoleAction[];
    readonly status: 'idle' | 'loading' | 'ready' | 'error';
    readonly refreshing?: boolean;
    readonly hasMore?: boolean;
    /** Called once on mount when the list is still `idle`. */
    readonly onFirstOpen?: () => void;
    readonly onRefresh?: () => void;
    readonly onLoadMore?: () => void;
    readonly onActionPress?: (action: ConsoleAction) => void;
}
export declare function ActivityTab(props: ActivityTabProps): React.JSX.Element;
//# sourceMappingURL=ActivityTab.d.ts.map