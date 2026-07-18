/**
 * Console offline banner — fixed-position notice when the device is offline.
 *
 * Per spec §4.5: "Showing your last-cached state. Some actions are
 * unavailable offline." Reads succeed from cache; revoke needs network.
 * This component is the visual; the `offline` boolean lives on the
 * `consoleReducer` state and is driven by the consuming app's connectivity
 * watcher (RN NetInfo or equivalent — we don't import it here to keep the
 * library connectivity-agnostic).
 */
import React from 'react';
import type { ConsoleTheme } from '../theme/tokens.js';
export interface OfflineBannerProps {
    readonly theme: ConsoleTheme;
    readonly visible: boolean;
    readonly label: string;
}
export declare function OfflineBanner(props: OfflineBannerProps): React.JSX.Element | null;
//# sourceMappingURL=OfflineBanner.d.ts.map