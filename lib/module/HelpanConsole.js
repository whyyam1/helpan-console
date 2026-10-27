"use strict";

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
 *     baseUrl="https://helpanai-production.up.railway.app"
 *     theme={{ primary: '#0D5C4E' }}
 *     lang="en"
 *     onClose={() => navigateBack()}
 *     onAuthorityRevoked={(id) => refreshAppState(id)}
 *   />
 */

import React, { useMemo, useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { ConsoleApiClient } from './api/client.js';
import { createTranslator } from './i18n/index.js';
import { resolveTheme } from './theme/tokens.js';
import { useConsoleData } from './hooks/useConsoleData.js';
import { selectActive, selectHistory, isRevoking as isRevokingSelector } from './state/reducer.js';
import { Tabs } from './components/Tabs.js';
import { OfflineBanner } from './components/OfflineBanner.js';
import { RevokeConfirmModal } from './components/RevokeConfirmModal.js';
import { ActiveTab } from './screens/ActiveTab.js';
import { ActivityTab } from './screens/ActivityTab.js';
import { HistoryTab } from './screens/HistoryTab.js';
import { AuthorityDetail } from './screens/AuthorityDetail.js';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Live rail host. `api.helpan.co.ke` is the JWT audience string only (no DNS
// yet) — switch this default once that domain is cut over.
const DEFAULT_BASE_URL = 'https://helpanai-production.up.railway.app';
export function HelpanConsole(props) {
  const {
    customerToken,
    appId,
    baseUrl = DEFAULT_BASE_URL,
    theme: themeInput,
    lang = 'en',
    onClose,
    onAuthorityRevoked,
    subscribeConnectivity
  } = props;
  const theme = useMemo(() => resolveTheme(themeInput), [themeInput]);
  const t = useMemo(() => createTranslator(lang), [lang]);
  const client = useMemo(() => new ConsoleApiClient({
    baseUrl,
    customerToken,
    appId
  }), [baseUrl, customerToken, appId]);
  const {
    state,
    actions
  } = useConsoleData({
    client,
    ...(subscribeConnectivity ? {
      subscribeConnectivity
    } : {})
  });
  const [tab, setTab] = useState('active');
  const [screen, setScreen] = useState({
    kind: 'tabs'
  });
  const [revokeTarget, setRevokeTarget] = useState(null);
  const active = selectActive(state);
  const history = selectHistory(state);
  const styles = makeStyles(theme);
  const handleRevokeConfirm = async () => {
    if (!revokeTarget) return;
    const id = revokeTarget.id;
    await actions.revokeAuthority(id);
    setRevokeTarget(null);
    // If the authority is now revoked in state, signal the parent.
    onAuthorityRevoked?.(id);
    // If we were on the detail screen, drop back to tabs since this
    // authority is now historical.
    if (screen.kind === 'detail' && screen.authorityId === id) {
      setScreen({
        kind: 'tabs'
      });
      setTab('history');
    }
  };
  const tabConfigs = [{
    key: 'active',
    label: t('tab.active'),
    badge: active.length
  }, {
    key: 'activity',
    label: t('tab.activity')
  }, {
    key: 'history',
    label: t('tab.history')
  }];
  return /*#__PURE__*/_jsxs(View, {
    style: styles.root,
    children: [/*#__PURE__*/_jsxs(View, {
      style: styles.header,
      children: [/*#__PURE__*/_jsx(Pressable, {
        onPress: onClose,
        style: ({
          pressed
        }) => [styles.closeBtn, pressed && styles.closeBtnPressed],
        accessibilityRole: "button",
        accessibilityLabel: t('common.done'),
        children: /*#__PURE__*/_jsx(Text, {
          style: styles.closeBtnText,
          children: t('common.done')
        })
      }), /*#__PURE__*/_jsx(Text, {
        style: styles.title,
        accessibilityRole: "header",
        children: t('header.title')
      }), /*#__PURE__*/_jsx(View, {
        style: styles.headerSpacer
      })]
    }), /*#__PURE__*/_jsx(OfflineBanner, {
      theme: theme,
      visible: state.offline,
      label: t('offline.banner')
    }), screen.kind === 'tabs' ? /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(Tabs, {
        theme: theme,
        tabs: tabConfigs,
        value: tab,
        onChange: setTab
      }), tab === 'active' ? /*#__PURE__*/_jsx(ActiveTab, {
        theme: theme,
        t: t,
        lang: lang,
        authorities: active,
        catalogue: state.scopes,
        refreshing: state.authorities.status === 'loading',
        hasMore: state.authorities.nextCursor !== null,
        onRefresh: () => void actions.loadAuthorities(),
        onLoadMore: () => void actions.loadMoreAuthorities(),
        onAuthorityPress: a => setScreen({
          kind: 'detail',
          authorityId: a.id
        }),
        onRevoke: a => setRevokeTarget(a),
        onViewActivity: () => setTab('activity')
      }) : null, tab === 'activity' ? /*#__PURE__*/_jsx(ActivityTab, {
        theme: theme,
        t: t,
        actions: state.actions.items,
        status: state.actions.status,
        refreshing: state.actions.status === 'loading',
        hasMore: state.actions.nextCursor !== null,
        onFirstOpen: () => void actions.loadActivity(),
        onRefresh: () => void actions.loadActivity(),
        onLoadMore: () => void actions.loadMoreActivity()
      }) : null, tab === 'history' ? /*#__PURE__*/_jsx(HistoryTab, {
        theme: theme,
        t: t,
        lang: lang,
        authorities: history,
        catalogue: state.scopes,
        refreshing: state.authorities.status === 'loading',
        onRefresh: () => void actions.loadAuthorities()
      }) : null]
    }) : /*#__PURE__*/_jsx(DetailFromState, {
      theme: theme,
      t: t,
      lang: lang,
      state: state,
      authorityId: screen.authorityId,
      onBack: () => setScreen({
        kind: 'tabs'
      }),
      onRevoke: a => setRevokeTarget(a)
    }), /*#__PURE__*/_jsx(RevokeConfirmModal, {
      theme: theme,
      t: t,
      visible: revokeTarget !== null,
      agentName: revokeTarget?.agent_id ?? '',
      isRevoking: revokeTarget ? isRevokingSelector(state, revokeTarget.id) : false,
      onConfirm: () => void handleRevokeConfirm(),
      onCancel: () => setRevokeTarget(null)
    })]
  });
}

// ---------------------------------------------------------------------------
// DetailFromState — finds the authority by id and renders AuthorityDetail
// with a back button. Centralised so the main composer stays linear.
// ---------------------------------------------------------------------------

function DetailFromState(props) {
  const {
    theme,
    t,
    lang,
    state,
    authorityId,
    onBack,
    onRevoke
  } = props;
  const authority = state.authorities.items.find(a => a.id === authorityId);
  const styles = makeStyles(theme);
  if (!authority) {
    return /*#__PURE__*/_jsx(View, {
      style: styles.detailFallback,
      children: /*#__PURE__*/_jsx(Pressable, {
        onPress: onBack,
        style: styles.backBtn,
        children: /*#__PURE__*/_jsxs(Text, {
          style: styles.backBtnText,
          children: ["\u2190 ", t('common.cancel')]
        })
      })
    });
  }
  return /*#__PURE__*/_jsxs(View, {
    style: {
      flex: 1
    },
    children: [/*#__PURE__*/_jsx(View, {
      style: styles.detailNav,
      children: /*#__PURE__*/_jsx(Pressable, {
        onPress: onBack,
        style: ({
          pressed
        }) => [styles.backBtn, pressed && styles.closeBtnPressed],
        accessibilityRole: "button",
        accessibilityLabel: t('common.cancel'),
        children: /*#__PURE__*/_jsxs(Text, {
          style: styles.backBtnText,
          children: ["\u2190 ", t('common.cancel')]
        })
      })
    }), /*#__PURE__*/_jsx(AuthorityDetail, {
      theme: theme,
      t: t,
      lang: lang,
      authority: authority,
      catalogue: state.scopes,
      actions: state.actions.items,
      onRevoke: () => onRevoke(authority)
    })]
  });
}

// ---------------------------------------------------------------------------

function makeStyles(theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 52
    },
    closeBtn: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs
    },
    closeBtnPressed: {
      opacity: 0.7
    },
    closeBtnText: {
      fontSize: theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
      fontFamily: theme.typography.fontFamily
    },
    title: {
      flex: 1,
      textAlign: 'center',
      fontSize: theme.typography.title,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily
    },
    headerSpacer: {
      width: 60 // matches roughly the close button width to keep title centred
    },
    detailNav: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    backBtn: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs
    },
    backBtnText: {
      fontSize: theme.typography.body,
      color: theme.colors.primary,
      fontWeight: '600',
      fontFamily: theme.typography.fontFamily
    },
    detailFallback: {
      flex: 1,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background
    }
  });
}
//# sourceMappingURL=HelpanConsole.js.map