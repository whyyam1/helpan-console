"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleReducer = consoleReducer;
exports.initialConsoleState = void 0;
exports.isRevoking = isRevoking;
exports.selectActive = selectActive;
exports.selectHistory = selectHistory;
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

function emptySlice() {
  return {
    status: 'idle',
    items: [],
    nextCursor: null,
    error: null
  };
}
const initialConsoleState = exports.initialConsoleState = {
  authorities: emptySlice(),
  actions: emptySlice(),
  scopes: new Map(),
  offline: false,
  revoking: []
};
function upsert(items, next) {
  const idx = items.findIndex(i => i.id === next.id);
  if (idx === -1) return [next, ...items];
  const copy = items.slice();
  copy[idx] = next;
  return copy;
}
function consoleReducer(state, action) {
  switch (action.type) {
    case 'authorities/loading':
      return {
        ...state,
        authorities: {
          ...state.authorities,
          status: 'loading',
          error: null
        }
      };
    case 'authorities/loaded':
      return {
        ...state,
        authorities: {
          status: 'ready',
          items: action.append ? [...state.authorities.items, ...action.items] : action.items,
          nextCursor: action.nextCursor,
          error: null
        }
      };
    case 'authorities/error':
      return {
        ...state,
        authorities: {
          ...state.authorities,
          status: 'error',
          error: action.error
        }
      };
    case 'actions/loading':
      return {
        ...state,
        actions: {
          ...state.actions,
          status: 'loading',
          error: null
        }
      };
    case 'actions/loaded':
      return {
        ...state,
        actions: {
          status: 'ready',
          items: action.append ? [...state.actions.items, ...action.items] : action.items,
          nextCursor: action.nextCursor,
          error: null
        }
      };
    case 'actions/error':
      return {
        ...state,
        actions: {
          ...state.actions,
          status: 'error',
          error: action.error
        }
      };
    case 'scopes/loaded':
      return {
        ...state,
        scopes: new Map(action.scopes.map(s => [s.id, s]))
      };
    case 'offline/set':
      return {
        ...state,
        offline: action.offline
      };
    case 'revoke/started':
      return state.revoking.includes(action.authorityId) ? state : {
        ...state,
        revoking: [...state.revoking, action.authorityId]
      };
    case 'revoke/failed':
      return {
        ...state,
        revoking: state.revoking.filter(id => id !== action.authorityId)
      };
    case 'revoke/succeeded':
      return {
        ...state,
        revoking: state.revoking.filter(id => id !== action.authority.id),
        authorities: {
          ...state.authorities,
          items: upsert(state.authorities.items, action.authority)
        }
      };
    case 'authority/upserted':
      return {
        ...state,
        authorities: {
          ...state.authorities,
          items: upsert(state.authorities.items, action.authority)
        }
      };
    default:
      {
        // Exhaustiveness — a new action type without a case is a compile error.
        const _never = action;
        return _never;
      }
  }
}

// ---- selectors -------------------------------------------------------------

/** Active tab — `status === 'active'`, newest first (input order preserved). */
function selectActive(state) {
  return state.authorities.items.filter(a => a.status === 'active');
}

/** History tab — revoked or expired authorities. */
function selectHistory(state) {
  return state.authorities.items.filter(a => a.status !== 'active');
}

/** Whether a revoke is in flight for the given authority. */
function isRevoking(state, authorityId) {
  return state.revoking.includes(authorityId);
}
//# sourceMappingURL=reducer.js.map