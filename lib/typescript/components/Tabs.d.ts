/**
 * Console top-level tabs — Active / Activity / History (spec §3.1).
 *
 * Pure controlled component. The parent owns the selected tab; this
 * component is the visual + accessibility surface only. Active gets a
 * count badge by default (every tab can opt in via `badge`).
 *
 * Visual: the active tab has an underline accent in `colors.primary`;
 * inactive tabs render in muted text. Spec §3.1 calls the underline a
 * "design polish" not a semantic — the primary affordance is the colour
 * shift, accessible via `accessibilityState.selected`.
 */
import React from 'react';
import type { ConsoleTheme } from '../theme/tokens.js';
export type TabKey = 'active' | 'activity' | 'history';
export interface TabConfig {
    readonly key: TabKey;
    readonly label: string;
    /** Optional count badge (e.g. number of active authorities). */
    readonly badge?: number;
}
export interface TabsProps {
    readonly theme: ConsoleTheme;
    readonly tabs: readonly TabConfig[];
    readonly value: TabKey;
    readonly onChange: (next: TabKey) => void;
}
export declare function Tabs(props: TabsProps): React.JSX.Element;
//# sourceMappingURL=Tabs.d.ts.map