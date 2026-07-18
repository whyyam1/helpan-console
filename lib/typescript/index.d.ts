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
export type { Authority, AuthorityScope, AuthorityStatus, AuthorityPeriod, IssueAuthorityRequest, ConsoleAction, ActionStatus, TargetRail, OauthScope, ScopeCategory, ElevationFriction, PageData, ResponseMeta, SuccessEnvelope, ErrorEnvelope, ErrorBody, } from './types.js';
export { isBehaviouralScope } from './types.js';
export { ConsoleApiClient, ConsoleApiError, type ConsoleApiConfig, type ListAuthoritiesQuery, type ListActionsQuery, } from './api/client.js';
export { createTranslator, isSupportedLang, type Lang, type MessageKey, type Translator, type TranslateParams, } from './i18n/index.js';
export { defaultTheme, resolveTheme, type ConsoleTheme, type ConsoleThemeInput, type ConsoleColors, type ConsoleSpacing, type ConsoleRadius, type ConsoleTypography, } from './theme/tokens.js';
export { formatMoneyMinor } from './format/money.js';
export { relativeParts, formatRelative, formatAbsoluteDate, type RelativeParts, type RelativeDirection, type RelativeUnit, } from './format/time.js';
export { scopeDisplayName, formatScopeLimit, isBehaviouralScopeId, } from './format/scopes.js';
export { consoleReducer, initialConsoleState, selectActive, selectHistory, isRevoking, type ConsoleState, type ListSlice, type LoadStatus, type ConsoleAction_Reducer, } from './state/reducer.js';
export { AuthorityCard, type AuthorityCardProps } from './components/AuthorityCard.js';
export { ScopeList, type ScopeListProps } from './components/ScopeList.js';
export { RevokeConfirmModal, type RevokeConfirmModalProps, } from './components/RevokeConfirmModal.js';
export { BehaviouralFrictionScreen, type BehaviouralFrictionScreenProps, } from './components/BehaviouralFrictionScreen.js';
export { EmptyState, type EmptyStateProps } from './components/EmptyState.js';
export { OfflineBanner, type OfflineBannerProps } from './components/OfflineBanner.js';
export { Tabs, type TabConfig, type TabKey, type TabsProps, } from './components/Tabs.js';
export { ActiveTab, type ActiveTabProps } from './screens/ActiveTab.js';
export { ActivityTab, type ActivityTabProps } from './screens/ActivityTab.js';
export { HistoryTab, type HistoryTabProps } from './screens/HistoryTab.js';
export { AuthorityDetail, type AuthorityDetailProps, } from './screens/AuthorityDetail.js';
export { GrantFlow, type GrantFlowProps } from './screens/GrantFlow.js';
export { useConsoleData, type UseConsoleDataOptions, type UseConsoleDataReturn, type ConsoleDataActions, } from './hooks/useConsoleData.js';
export { HelpanConsole, type HelpanConsoleProps } from './HelpanConsole.js';
//# sourceMappingURL=index.d.ts.map