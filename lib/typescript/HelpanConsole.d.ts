/**
 * `<HelpanConsole>` — the Console's top-level composer (Console spec §2.1).
 *
 * The single piece a consuming app actually renders. It owns:
 *   - The `ConsoleApiClient` (built from `customerToken` + `appId` + `baseUrl`)
 *   - The `useConsoleData` hook
 *   - Top-level navigation between tab + detail + grant screens
 *   - The revoke modal lifecycle
 *
 * The consuming app renders this as a full-screen modal / route; the
 * library does not own a `Modal` wrapper because consumers may want to
 * embed it inline (e.g. a settings page tab) — see the imperative
 * `HelpanConsoleAPI.open()` for the modal pattern.
 *
 * Spec §2.1 invocation shape:
 *   <HelpanConsole
 *     customerToken="<Identiti customer JWT>"
 *     appId="lunchdrop"
 *     baseUrl="https://api.helpan.co.ke"
 *     theme={{ primary: '#0D5C4E' }}
 *     lang="en"
 *     onClose={() => navigateBack()}
 *     onAuthorityRevoked={(id) => refreshAppState(id)}
 *   />
 */
import React from 'react';
import { type Lang } from './i18n/index.js';
import { type ConsoleThemeInput } from './theme/tokens.js';
export interface HelpanConsoleProps {
    /** Identiti customer JWT — the authenticated user, via the consuming app. */
    readonly customerToken: string;
    /** The consuming app's id — `lunchdrop` / `klokd` / `chapaa` etc. */
    readonly appId: string;
    /**
     * Rail base URL — defaults to the production Helpan AI rail. Override
     * in dev / staging via env.
     */
    readonly baseUrl?: string;
    /** Brand-overridable theme tokens. Structural tokens are fixed. */
    readonly theme?: ConsoleThemeInput;
    /** UI language. Defaults to 'en'. */
    readonly lang?: Lang;
    /** Called when the user dismisses the Console (chrome close button). */
    readonly onClose: () => void;
    /** Optional callback when an authority is successfully revoked. */
    readonly onAuthorityRevoked?: (authorityId: string) => void;
    /** Optional connectivity watcher (RN NetInfo or equivalent on the app side). */
    readonly subscribeConnectivity?: (cb: (offline: boolean) => void) => () => void;
}
export declare function HelpanConsole(props: HelpanConsoleProps): React.JSX.Element;
//# sourceMappingURL=HelpanConsole.d.ts.map