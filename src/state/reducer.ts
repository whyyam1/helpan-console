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

function emptySlice<T>(): ListSlice<T> {
  return { status: 'idle', items: [], nextCursor: null, error: null };
}

export const initialConsoleState: ConsoleState = {
  authorities: emptySlice<Authority>(),
  actions: emptySlice<ConsoleAction>(),
  scopes: new Map(),
  offline: false,
  revoking: [],
};

export type ConsoleAction_Reducer =
  | { type: 'authorities/loading' }
  | { type: 'authorities/loaded'; items: Authority[]; nextCursor: string | null; append: boolean }
  | { type: 'authorities/error'; error: string }
  | { type: 'actions/loading' }
  | { type: 'actions/loaded'; items: ConsoleAction[]; nextCursor: string | null; append: boolean }
  | { type: 'actions/error'; error: string }
  | { type: 'scopes/loaded'; scopes: OauthScope[] }
  | { type: 'offline/set'; offline: boolean }
  | { type: 'revoke/started'; authorityId: string }
  | { type: 'revoke/succeeded'; authority: Authority }
  | { type: 'revoke/failed'; authorityId: string }
  | { type: 'authority/upserted'; authority: Authority };

function upsert<T extends { id: string }>(items: T[], next: T): T[] {
  const idx = items.findIndex((i) => i.id === next.id);
  if (idx === -1) return [next, ...items];
  const copy = items.slice();
  copy[idx] = next;
  return copy;
}

export function consoleReducer(
  state: ConsoleState,
  action: ConsoleAction_Reducer
): ConsoleState {
  switch (action.type) {
    case 'authorities/loading':
      return { ...state, authorities: { ...state.authorities, status: 'loading', error: null } };
    case 'authorities/loaded':
      return {
        ...state,
        authorities: {
          status: 'ready',
          items: action.append
            ? [...state.authorities.items, ...action.items]
            : action.items,
          nextCursor: action.nextCursor,
          error: null,
        },
      };
    case 'authorities/error':
      return {
        ...state,
        authorities: { ...state.authorities, status: 'error', error: action.error },
      };

    case 'actions/loading':
      return { ...state, actions: { ...state.actions, status: 'loading', error: null } };
    case 'actions/loaded':
      return {
        ...state,
        actions: {
          status: 'ready',
          items: action.append ? [...state.actions.items, ...action.items] : action.items,
          nextCursor: action.nextCursor,
          error: null,
        },
      };
    case 'actions/error':
      return { ...state, actions: { ...state.actions, status: 'error', error: action.error } };

    case 'scopes/loaded':
      return { ...state, scopes: new Map(action.scopes.map((s) => [s.id, s])) };

    case 'offline/set':
      return { ...state, offline: action.offline };

    case 'revoke/started':
      return state.revoking.includes(action.authorityId)
        ? state
        : { ...state, revoking: [...state.revoking, action.authorityId] };
    case 'revoke/failed':
      return {
        ...state,
        revoking: state.revoking.filter((id) => id !== action.authorityId),
      };
    case 'revoke/succeeded':
      return {
        ...state,
        revoking: state.revoking.filter((id) => id !== action.authority.id),
        authorities: {
          ...state.authorities,
          items: upsert(state.authorities.items, action.authority),
        },
      };

    case 'authority/upserted':
      return {
        ...state,
        authorities: {
          ...state.authorities,
          items: upsert(state.authorities.items, action.authority),
        },
      };

    default: {
      // Exhaustiveness — a new action type without a case is a compile error.
      const _never: never = action;
      return _never;
    }
  }
}

// ---- selectors -------------------------------------------------------------

/** Active tab — `status === 'active'`, newest first (input order preserved). */
export function selectActive(state: ConsoleState): Authority[] {
  return state.authorities.items.filter((a) => a.status === 'active');
}

/** History tab — revoked or expired authorities. */
export function selectHistory(state: ConsoleState): Authority[] {
  return state.authorities.items.filter((a) => a.status !== 'active');
}

/** Whether a revoke is in flight for the given authority. */
export function isRevoking(state: ConsoleState, authorityId: string): boolean {
  return state.revoking.includes(authorityId);
}
