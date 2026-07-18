/**
 * useConsoleData — the React layer over the pure `consoleReducer`.
 *
 * Owns:
 *   1. `useReducer(consoleReducer, initialConsoleState)` — state machine
 *   2. A set of API-bound action creators (`loadAuthorities`, `revokeAuthority`,
 *      `loadActivity`, `loadScopes`, etc.) that call `ConsoleApiClient` and
 *      dispatch the appropriate reducer actions
 *   3. Lifecycle effects (initial load on mount; optional connectivity watch
 *      via an injected `subscribeConnectivity` hook so the library stays
 *      RN-NetInfo-agnostic)
 *
 * Pure logic stays in the foundation: the reducer transitions are unit-
 * tested in plain Node (`reducer.test.ts`); this hook just wires the
 * reducer up to React + the API. Side-effect ordering — load-first, then
 * dispatch — matches the foundation's `'…/loading'` → `'…/loaded'` /
 * `'…/error'` action pairs.
 *
 * The hook returns `state` (immutable view; safe to pass to children) and
 * an `actions` object whose function identities are stable across renders
 * (memoised against the api client reference) so consumers can list them
 * in `useEffect` deps without thrash.
 */
import type { ConsoleApiClient } from '../api/client.js';
import { type ConsoleState } from '../state/reducer.js';
export interface UseConsoleDataOptions {
    readonly client: ConsoleApiClient;
    /**
     * Skip the initial mount load. Useful for stories / tests where the
     * caller pre-populates state via dispatch. Default `false`.
     */
    readonly skipInitialLoad?: boolean;
    /**
     * Inject a connectivity watcher. The consuming app calls
     * `subscribe(cb)`; `cb(true)` puts the Console into offline mode,
     * `cb(false)` clears it. Return value is a teardown.
     * Optional — without it the Console always reports online.
     */
    readonly subscribeConnectivity?: (cb: (offline: boolean) => void) => () => void;
}
export interface ConsoleDataActions {
    loadAuthorities(opts?: {
        append?: boolean;
    }): Promise<void>;
    loadMoreAuthorities(): Promise<void>;
    loadActivity(opts?: {
        append?: boolean;
    }): Promise<void>;
    loadMoreActivity(): Promise<void>;
    loadScopes(rail?: string): Promise<void>;
    revokeAuthority(authorityId: string): Promise<void>;
}
export interface UseConsoleDataReturn {
    readonly state: ConsoleState;
    readonly actions: ConsoleDataActions;
}
export declare function useConsoleData(opts: UseConsoleDataOptions): UseConsoleDataReturn;
//# sourceMappingURL=useConsoleData.d.ts.map