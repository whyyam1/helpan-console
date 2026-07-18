/**
 * Pure reducer for the Console's data state.
 *
 * Kept free of React so the state transitions are unit-testable in plain
 * Node; the `useConsoleData` hook (component layer) wraps this reducer with
 * `useReducer` + the `ConsoleApiClient`.
 *
 * One authorities list holds every authority; the tabs are *selectors* over
 * it — Active = `status==='active'`, History = revoked / expired. The
 * Activity tab has its own list (`actions`).
 */
import type { Authority, ConsoleAction, OauthScope } from '../types.js';
export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';
export interface ListSlice<T> {
    status: LoadStatus;
    items: T[];
    nextCursor: string | null;
    error: string | null;
}
export interface ConsoleState {
    authorities: ListSlice<Authority>;
    actions: ListSlice<ConsoleAction>;
    /** Scope catalogue, keyed by scope_id — for human-readable scope display. */
    scopes: ReadonlyMap<string, OauthScope>;
    offline: boolean;
    /** Authority ids with a revoke request in flight. */
    revoking: readonly string[];
}
export declare const initialConsoleState: ConsoleState;
export type ConsoleAction_Reducer = {
    type: 'authorities/loading';
} | {
    type: 'authorities/loaded';
    items: Authority[];
    nextCursor: string | null;
    append: boolean;
} | {
    type: 'authorities/error';
    error: string;
} | {
    type: 'actions/loading';
} | {
    type: 'actions/loaded';
    items: ConsoleAction[];
    nextCursor: string | null;
    append: boolean;
} | {
    type: 'actions/error';
    error: string;
} | {
    type: 'scopes/loaded';
    scopes: OauthScope[];
} | {
    type: 'offline/set';
    offline: boolean;
} | {
    type: 'revoke/started';
    authorityId: string;
} | {
    type: 'revoke/succeeded';
    authority: Authority;
} | {
    type: 'revoke/failed';
    authorityId: string;
} | {
    type: 'authority/upserted';
    authority: Authority;
};
export declare function consoleReducer(state: ConsoleState, action: ConsoleAction_Reducer): ConsoleState;
/** Active tab — `status === 'active'`, newest first (input order preserved). */
export declare function selectActive(state: ConsoleState): Authority[];
/** History tab — revoked or expired authorities. */
export declare function selectHistory(state: ConsoleState): Authority[];
/** Whether a revoke is in flight for the given authority. */
export declare function isRevoking(state: ConsoleState, authorityId: string): boolean;
//# sourceMappingURL=reducer.d.ts.map