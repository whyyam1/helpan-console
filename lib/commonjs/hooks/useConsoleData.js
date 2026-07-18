"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useConsoleData = useConsoleData;
var _react = require("react");
var _reducer = require("../state/reducer.js");
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

function useConsoleData(opts) {
  const [state, dispatch] = (0, _react.useReducer)(_reducer.consoleReducer, _reducer.initialConsoleState);
  const {
    client
  } = opts;

  // Keep the latest state in a ref so the action creators can read
  // `nextCursor` without being recreated on every render.
  const stateRef = (0, _react.useRef)(state);
  stateRef.current = state;
  const loadAuthorities = (0, _react.useCallback)(async loadOpts => {
    const append = loadOpts?.append === true;
    dispatch({
      type: 'authorities/loading'
    });
    try {
      const cursor = append ? stateRef.current.authorities.nextCursor : null;
      const page = await client.listAuthorities(cursor ? {
        cursor
      } : {});
      dispatch({
        type: 'authorities/loaded',
        items: page.items,
        nextCursor: page.next_cursor ?? null,
        append
      });
    } catch (err) {
      dispatch({
        type: 'authorities/error',
        error: err.message ?? 'load failed'
      });
    }
  }, [client]);
  const loadMoreAuthorities = (0, _react.useCallback)(async () => {
    if (stateRef.current.authorities.nextCursor) {
      await loadAuthorities({
        append: true
      });
    }
  }, [loadAuthorities]);
  const loadActivity = (0, _react.useCallback)(async loadOpts => {
    const append = loadOpts?.append === true;
    dispatch({
      type: 'actions/loading'
    });
    try {
      const cursor = append ? stateRef.current.actions.nextCursor : null;
      const page = await client.listActions(cursor ? {
        cursor
      } : {});
      dispatch({
        type: 'actions/loaded',
        items: page.items,
        nextCursor: page.next_cursor ?? null,
        append
      });
    } catch (err) {
      dispatch({
        type: 'actions/error',
        error: err.message ?? 'load failed'
      });
    }
  }, [client]);
  const loadMoreActivity = (0, _react.useCallback)(async () => {
    if (stateRef.current.actions.nextCursor) {
      await loadActivity({
        append: true
      });
    }
  }, [loadActivity]);
  const loadScopes = (0, _react.useCallback)(async rail => {
    try {
      const scopes = await client.listScopes(rail);
      dispatch({
        type: 'scopes/loaded',
        scopes
      });
    } catch {
      // Scope load is non-blocking — the Console renders with raw
      // `scope_id` strings if the catalogue fetch fails. Swallow.
    }
  }, [client]);
  const revokeAuthority = (0, _react.useCallback)(async authorityId => {
    dispatch({
      type: 'revoke/started',
      authorityId
    });
    try {
      const updated = await client.revokeAuthority(authorityId);
      dispatch({
        type: 'revoke/succeeded',
        authority: updated
      });
    } catch {
      dispatch({
        type: 'revoke/failed',
        authorityId
      });
    }
  }, [client]);

  // Stable action surface — same object identity across renders.
  const actions = (0, _react.useMemo)(() => ({
    loadAuthorities,
    loadMoreAuthorities,
    loadActivity,
    loadMoreActivity,
    loadScopes,
    revokeAuthority
  }), [loadAuthorities, loadMoreAuthorities, loadActivity, loadMoreActivity, loadScopes, revokeAuthority]);

  // ---- initial load ------------------------------------------------------
  (0, _react.useEffect)(() => {
    if (opts.skipInitialLoad) return;
    void actions.loadScopes();
    void actions.loadAuthorities();
    // actions.loadActivity is called lazily by the Activity tab when first
    // shown — no need to incur its cost on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  // ---- connectivity watch -----------------------------------------------
  (0, _react.useEffect)(() => {
    const sub = opts.subscribeConnectivity;
    if (!sub) return undefined;
    const unsubscribe = sub(offline => {
      dispatch({
        type: 'offline/set',
        offline
      });
    });
    return unsubscribe;
  }, [opts.subscribeConnectivity]);
  return {
    state,
    actions
  };
}
//# sourceMappingURL=useConsoleData.js.map