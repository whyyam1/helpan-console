/**
 * Console empty state — shown in any tab whose list is empty.
 *
 * Per Console spec §3.6 — each tab has its own empty copy ("No active
 * authorities…" / "Agents acting on your behalf will show up here." /
 * "Revoked or expired permissions will be listed here."). This component
 * is the layout container; callers pass the strings + an optional emoji
 * glyph so we don't bring an icon library into the rail-side foundation.
 */
import React from 'react';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface EmptyStateProps {
    readonly theme: ConsoleTheme;
    readonly title: string;
    readonly body: string;
    /** Optional small emoji / single-char glyph rendered above the title. */
    readonly glyph?: string;
}
export declare function EmptyState(props: EmptyStateProps): React.JSX.Element;
//# sourceMappingURL=EmptyState.d.ts.map