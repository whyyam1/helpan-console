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
export type {
  Authority,
  AuthorityScope,
  AuthorityStatus,
  AuthorityPeriod,
  IssueAuthorityRequest,
  ConsoleAction,
  ActionStatus,
  TargetRail,
  OauthScope,
  ScopeCategory,
  ElevationFriction,
  PageData,
  ResponseMeta,
  SuccessEnvelope,
  ErrorEnvelope,
  ErrorBody,
} from './types.js';
export { isBehaviouralScope } from './types.js';

// ---- API client ------------------------------------------------------------
export {
  ConsoleApiClient,
  ConsoleApiError,
  type ConsoleApiConfig,
  type ListAuthoritiesQuery,
  type ListActionsQuery,
} from './api/client.js';

// ---- i18n ------------------------------------------------------------------
export {
  createTranslator,
  isSupportedLang,
  type Lang,
  type MessageKey,
  type Translator,
  type TranslateParams,
} from './i18n/index.js';

// ---- theme -----------------------------------------------------------------
export {
  defaultTheme,
  resolveTheme,
  type ConsoleTheme,
  type ConsoleThemeInput,
  type ConsoleColors,
  type ConsoleSpacing,
  type ConsoleRadius,
  type ConsoleTypography,
} from './theme/tokens.js';

// ---- formatters ------------------------------------------------------------
export { formatMoneyMinor } from './format/money.js';
export {
  relativeParts,
  formatRelative,
  formatAbsoluteDate,
  type RelativeParts,
  type RelativeDirection,
  type RelativeUnit,
} from './format/time.js';
export {
  scopeDisplayName,
  formatScopeLimit,
  isBehaviouralScopeId,
} from './format/scopes.js';

// ---- state -----------------------------------------------------------------
export {
  consoleReducer,
  initialConsoleState,
  selectActive,
  selectHistory,
  isRevoking,
  type ConsoleState,
  type ListSlice,
  type LoadStatus,
  type ConsoleAction_Reducer,
} from './state/reducer.js';

// ---- components (UI layer, post-H-8b foundation; §6.19 Slice 1) ------------
//
// React Native primitives — components consume `react` + `react-native` from
// the consuming app (peer deps). The foundation above does NOT require RN;
// only the imports below do.
export { AuthorityCard, type AuthorityCardProps } from './components/AuthorityCard.js';
export { ScopeList, type ScopeListProps } from './components/ScopeList.js';
export {
  RevokeConfirmModal,
  type RevokeConfirmModalProps,
} from './components/RevokeConfirmModal.js';
export {
  BehaviouralFrictionScreen,
  type BehaviouralFrictionScreenProps,
} from './components/BehaviouralFrictionScreen.js';
export { EmptyState, type EmptyStateProps } from './components/EmptyState.js';
export { OfflineBanner, type OfflineBannerProps } from './components/OfflineBanner.js';
export {
  Tabs,
  type TabConfig,
  type TabKey,
  type TabsProps,
} from './components/Tabs.js';

// ---- screens (Slice 2 — H-8b UI layer continued) ---------------------------
export { ActiveTab, type ActiveTabProps } from './screens/ActiveTab.js';
export { ActivityTab, type ActivityTabProps } from './screens/ActivityTab.js';
export { HistoryTab, type HistoryTabProps } from './screens/HistoryTab.js';
export {
  AuthorityDetail,
  type AuthorityDetailProps,
} from './screens/AuthorityDetail.js';
export { GrantFlow, type GrantFlowProps } from './screens/GrantFlow.js';

// ---- hook (Slice 2 — wires reducer + API to React) ------------------------
export {
  useConsoleData,
  type UseConsoleDataOptions,
  type UseConsoleDataReturn,
  type ConsoleDataActions,
} from './hooks/useConsoleData.js';

// ---- public entry (Slice 3 — Console spec §2.1) ---------------------------
export { HelpanConsole, type HelpanConsoleProps } from './HelpanConsole.js';
