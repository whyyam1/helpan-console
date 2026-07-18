"use strict";

/**
 * `@kmv/helpan-console` — public entry.
 *
 * The Helpan Console: the KMV platform's user-facing agent-consent surface,
 * a shared React Native library invoked from each consuming app
 * (`HelpanConsole.open({ customerToken, appId, theme, onClose, ... })`).
 *
 * H-8b build phases:
 *   1. Foundation (this file's current exports) — types, API client, i18n,
 *      theme tokens, formatters, pure state reducer. Verified under Node
 *      with vitest; no React Native dependency.
 *   2. Components + screens + the imperative `HelpanConsole` entry — added
 *      next; they bring in `react` / `react-native`.
 */

// ---- types -----------------------------------------------------------------

export { isBehaviouralScope } from './types.js';

// ---- API client ------------------------------------------------------------
export { ConsoleApiClient, ConsoleApiError } from './api/client.js';

// ---- i18n ------------------------------------------------------------------
export { createTranslator, isSupportedLang } from './i18n/index.js';

// ---- theme -----------------------------------------------------------------
export { defaultTheme, resolveTheme } from './theme/tokens.js';

// ---- formatters ------------------------------------------------------------
export { formatMoneyMinor } from './format/money.js';
export { relativeParts, formatRelative, formatAbsoluteDate } from './format/time.js';
export { scopeDisplayName, formatScopeLimit, isBehaviouralScopeId } from './format/scopes.js';

// ---- state -----------------------------------------------------------------
export { consoleReducer, initialConsoleState, selectActive, selectHistory, isRevoking } from './state/reducer.js';

// ---- components (UI layer, post-H-8b foundation; §6.19 Slice 1) ------------
//
// React Native primitives — components consume `react` + `react-native` from
// the consuming app (peer deps). The foundation above does NOT require RN;
// only the imports below do.
export { AuthorityCard } from './components/AuthorityCard.js';
export { ScopeList } from './components/ScopeList.js';
export { RevokeConfirmModal } from './components/RevokeConfirmModal.js';
export { BehaviouralFrictionScreen } from './components/BehaviouralFrictionScreen.js';
export { EmptyState } from './components/EmptyState.js';
export { OfflineBanner } from './components/OfflineBanner.js';
export { Tabs } from './components/Tabs.js';

// ---- screens (Slice 2 — H-8b UI layer continued) ---------------------------
export { ActiveTab } from './screens/ActiveTab.js';
export { ActivityTab } from './screens/ActivityTab.js';
export { HistoryTab } from './screens/HistoryTab.js';
export { AuthorityDetail } from './screens/AuthorityDetail.js';
export { GrantFlow } from './screens/GrantFlow.js';

// ---- hook (Slice 2 — wires reducer + API to React) ------------------------
export { useConsoleData } from './hooks/useConsoleData.js';

// ---- public entry (Slice 3 — Console spec §2.1) ---------------------------
export { HelpanConsole } from './HelpanConsole.js';
//# sourceMappingURL=index.js.map