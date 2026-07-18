"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HelpanConsole = HelpanConsole;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _client = require("./api/client.js");
var _index = require("./i18n/index.js");
var _tokens = require("./theme/tokens.js");
var _useConsoleData = require("./hooks/useConsoleData.js");
var _reducer = require("./state/reducer.js");
var _Tabs = require("./components/Tabs.js");
var _OfflineBanner = require("./components/OfflineBanner.js");
var _RevokeConfirmModal = require("./components/RevokeConfirmModal.js");
var _ActiveTab = require("./screens/ActiveTab.js");
var _ActivityTab = require("./screens/ActivityTab.js");
var _HistoryTab = require("./screens/HistoryTab.js");
var _AuthorityDetail = require("./screens/AuthorityDetail.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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

const DEFAULT_BASE_URL = 'https://api.helpan.co.ke';
function HelpanConsole(props) {
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
  const theme = (0, _react.useMemo)(() => (0, _tokens.resolveTheme)(themeInput), [themeInput]);
  const t = (0, _react.useMemo)(() => (0, _index.createTranslator)(lang), [lang]);
  const client = (0, _react.useMemo)(() => new _client.ConsoleApiClient({
    baseUrl,
    customerToken,
    appId
  }), [baseUrl, customerToken, appId]);
  const {
    state,
    actions
  } = (0, _useConsoleData.useConsoleData)({
    client,
    ...(subscribeConnectivity ? {
      subscribeConnectivity
    } : {})
  });
  const [tab, setTab] = (0, _react.useState)('active');
  const [screen, setScreen] = (0, _react.useState)({
    kind: 'tabs'
  });
  const [revokeTarget, setRevokeTarget] = (0, _react.useState)(null);
  const active = (0, _reducer.selectActive)(state);
  const history = (0, _reducer.selectHistory)(state);
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: styles.root,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: styles.header,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        onPress: onClose,
        style: ({
          pressed
        }) => [styles.closeBtn, pressed && styles.closeBtnPressed],
        accessibilityRole: "button",
        accessibilityLabel: t('common.done'),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.closeBtnText,
          children: t('common.done')
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.title,
        accessibilityRole: "header",
        children: t('header.title')
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: styles.headerSpacer
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_OfflineBanner.OfflineBanner, {
      theme: theme,
      visible: state.offline,
      label: t('offline.banner')
    }), screen.kind === 'tabs' ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tabs.Tabs, {
        theme: theme,
        tabs: tabConfigs,
        value: tab,
        onChange: setTab
      }), tab === 'active' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_ActiveTab.ActiveTab, {
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
      }) : null, tab === 'activity' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_ActivityTab.ActivityTab, {
        theme: theme,
        t: t,
        actions: state.actions.items,
        status: state.actions.status,
        refreshing: state.actions.status === 'loading',
        hasMore: state.actions.nextCursor !== null,
        onFirstOpen: () => void actions.loadActivity(),
        onRefresh: () => void actions.loadActivity(),
        onLoadMore: () => void actions.loadMoreActivity()
      }) : null, tab === 'history' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_HistoryTab.HistoryTab, {
        theme: theme,
        t: t,
        lang: lang,
        authorities: history,
        catalogue: state.scopes,
        refreshing: state.authorities.status === 'loading',
        onRefresh: () => void actions.loadAuthorities()
      }) : null]
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(DetailFromState, {
      theme: theme,
      t: t,
      lang: lang,
      state: state,
      authorityId: screen.authorityId,
      onBack: () => setScreen({
        kind: 'tabs'
      }),
      onRevoke: a => setRevokeTarget(a)
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_RevokeConfirmModal.RevokeConfirmModal, {
      theme: theme,
      t: t,
      visible: revokeTarget !== null,
      agentName: revokeTarget?.agent_id ?? '',
      isRevoking: revokeTarget ? (0, _reducer.isRevoking)(state, revokeTarget.id) : false,
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
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.detailFallback,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        onPress: onBack,
        style: styles.backBtn,
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, {
          style: styles.backBtnText,
          children: ["\u2190 ", t('common.cancel')]
        })
      })
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: {
      flex: 1
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.detailNav,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        onPress: onBack,
        style: ({
          pressed
        }) => [styles.backBtn, pressed && styles.closeBtnPressed],
        accessibilityRole: "button",
        accessibilityLabel: t('common.cancel'),
        children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, {
          style: styles.backBtnText,
          children: ["\u2190 ", t('common.cancel')]
        })
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_AuthorityDetail.AuthorityDetail, {
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
  return _reactNative.StyleSheet.create({
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