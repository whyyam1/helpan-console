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

import React, { useMemo, useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { ConsoleApiClient } from './api/client.js';
import { createTranslator, type Lang } from './i18n/index.js';
import { resolveTheme, type ConsoleThemeInput } from './theme/tokens.js';
import { useConsoleData } from './hooks/useConsoleData.js';
import {
  selectActive,
  selectHistory,
  isRevoking as isRevokingSelector,
} from './state/reducer.js';
import { Tabs, type TabKey } from './components/Tabs.js';
import { OfflineBanner } from './components/OfflineBanner.js';
import { RevokeConfirmModal } from './components/RevokeConfirmModal.js';
import { ActiveTab } from './screens/ActiveTab.js';
import { ActivityTab } from './screens/ActivityTab.js';
import { HistoryTab } from './screens/HistoryTab.js';
import { AuthorityDetail } from './screens/AuthorityDetail.js';
import type { Authority } from './types.js';

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

const DEFAULT_BASE_URL = 'https://api.helpan.co.ke';

type Screen =
  | { kind: 'tabs' }
  | { kind: 'detail'; authorityId: string };

export function HelpanConsole(props: HelpanConsoleProps): React.JSX.Element {
  const {
    customerToken,
    appId,
    baseUrl = DEFAULT_BASE_URL,
    theme: themeInput,
    lang = 'en',
    onClose,
    onAuthorityRevoked,
    subscribeConnectivity,
  } = props;

  const theme = useMemo(() => resolveTheme(themeInput), [themeInput]);
  const t = useMemo(() => createTranslator(lang), [lang]);

  const client = useMemo(
    () =>
      new ConsoleApiClient({
        baseUrl,
        customerToken,
        appId,
      }),
    [baseUrl, customerToken, appId]
  );

  const { state, actions } = useConsoleData({
    client,
    ...(subscribeConnectivity ? { subscribeConnectivity } : {}),
  });

  const [tab, setTab] = useState<TabKey>('active');
  const [screen, setScreen] = useState<Screen>({ kind: 'tabs' });
  const [revokeTarget, setRevokeTarget] = useState<Authority | null>(null);

  const active = selectActive(state);
  const history = selectHistory(state);
  const styles = makeStyles(theme);

  const handleRevokeConfirm = async (): Promise<void> => {
    if (!revokeTarget) return;
    const id = revokeTarget.id;
    await actions.revokeAuthority(id);
    setRevokeTarget(null);
    // If the authority is now revoked in state, signal the parent.
    onAuthorityRevoked?.(id);
    // If we were on the detail screen, drop back to tabs since this
    // authority is now historical.
    if (screen.kind === 'detail' && screen.authorityId === id) {
      setScreen({ kind: 'tabs' });
      setTab('history');
    }
  };

  const tabConfigs = [
    { key: 'active' as const, label: t('tab.active'), badge: active.length },
    { key: 'activity' as const, label: t('tab.activity') },
    { key: 'history' as const, label: t('tab.history') },
  ];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeBtn,
            pressed && styles.closeBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('common.done')}
        >
          <Text style={styles.closeBtnText}>{t('common.done')}</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          {t('header.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <OfflineBanner theme={theme} visible={state.offline} label={t('offline.banner')} />

      {screen.kind === 'tabs' ? (
        <>
          <Tabs theme={theme} tabs={tabConfigs} value={tab} onChange={setTab} />
          {tab === 'active' ? (
            <ActiveTab
              theme={theme}
              t={t}
              lang={lang}
              authorities={active}
              catalogue={state.scopes}
              refreshing={state.authorities.status === 'loading'}
              hasMore={state.authorities.nextCursor !== null}
              onRefresh={() => void actions.loadAuthorities()}
              onLoadMore={() => void actions.loadMoreAuthorities()}
              onAuthorityPress={(a) =>
                setScreen({ kind: 'detail', authorityId: a.id })
              }
              onRevoke={(a) => setRevokeTarget(a)}
              onViewActivity={() => setTab('activity')}
            />
          ) : null}
          {tab === 'activity' ? (
            <ActivityTab
              theme={theme}
              t={t}
              actions={state.actions.items}
              status={state.actions.status}
              refreshing={state.actions.status === 'loading'}
              hasMore={state.actions.nextCursor !== null}
              onFirstOpen={() => void actions.loadActivity()}
              onRefresh={() => void actions.loadActivity()}
              onLoadMore={() => void actions.loadMoreActivity()}
            />
          ) : null}
          {tab === 'history' ? (
            <HistoryTab
              theme={theme}
              t={t}
              lang={lang}
              authorities={history}
              catalogue={state.scopes}
              refreshing={state.authorities.status === 'loading'}
              onRefresh={() => void actions.loadAuthorities()}
            />
          ) : null}
        </>
      ) : (
        <DetailFromState
          theme={theme}
          t={t}
          lang={lang}
          state={state}
          authorityId={screen.authorityId}
          onBack={() => setScreen({ kind: 'tabs' })}
          onRevoke={(a) => setRevokeTarget(a)}
        />
      )}

      <RevokeConfirmModal
        theme={theme}
        t={t}
        visible={revokeTarget !== null}
        agentName={revokeTarget?.agent_id ?? ''}
        isRevoking={
          revokeTarget ? isRevokingSelector(state, revokeTarget.id) : false
        }
        onConfirm={() => void handleRevokeConfirm()}
        onCancel={() => setRevokeTarget(null)}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// DetailFromState — finds the authority by id and renders AuthorityDetail
// with a back button. Centralised so the main composer stays linear.
// ---------------------------------------------------------------------------

interface DetailFromStateProps {
  readonly theme: ReturnType<typeof resolveTheme>;
  readonly t: ReturnType<typeof createTranslator>;
  readonly lang: Lang;
  readonly state: ReturnType<typeof useConsoleData>['state'];
  readonly authorityId: string;
  readonly onBack: () => void;
  readonly onRevoke: (a: Authority) => void;
}

function DetailFromState(props: DetailFromStateProps): React.JSX.Element {
  const { theme, t, lang, state, authorityId, onBack, onRevoke } = props;
  const authority = state.authorities.items.find((a) => a.id === authorityId);
  const styles = makeStyles(theme);
  if (!authority) {
    return (
      <View style={styles.detailFallback}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← {t('common.cancel')}</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.detailNav}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.closeBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}
        >
          <Text style={styles.backBtnText}>← {t('common.cancel')}</Text>
        </Pressable>
      </View>
      <AuthorityDetail
        theme={theme}
        t={t}
        lang={lang}
        authority={authority}
        catalogue={state.scopes}
        actions={state.actions.items}
        onRevoke={() => onRevoke(authority)}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------

function makeStyles(theme: ReturnType<typeof resolveTheme>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 52,
    },
    closeBtn: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    closeBtnPressed: { opacity: 0.7 },
    closeBtnText: {
      fontSize: theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600' as const,
      fontFamily: theme.typography.fontFamily,
    },
    title: {
      flex: 1,
      textAlign: 'center' as const,
      fontSize: theme.typography.title,
      fontWeight: '700' as const,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
    },
    headerSpacer: {
      width: 60, // matches roughly the close button width to keep title centred
    },
    detailNav: {
      flexDirection: 'row' as const,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backBtn: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    backBtnText: {
      fontSize: theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600' as const,
      fontFamily: theme.typography.fontFamily,
    },
    detailFallback: {
      flex: 1,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
  });
}
