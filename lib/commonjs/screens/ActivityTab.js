"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActivityTab = ActivityTab;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _EmptyState = require("../components/EmptyState.js");
var _time = require("../format/time.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Activity tab — agent action log (spec §3.4).
 *
 * Reverse-chronological list. Each row shows agent + operation + status +
 * timestamp. Failed actions surface the error_code below the title in
 * muted text. The list is loaded lazily — the parent calls
 * `actions.loadActivity()` the first time this tab is opened (the hook
 * does not auto-load on mount, by design).
 */

function ActivityTab(props) {
  const {
    theme,
    t,
    actions,
    status,
    refreshing,
    hasMore,
    onFirstOpen,
    onRefresh,
    onLoadMore,
    onActionPress
  } = props;
  const styles = makeStyles(theme);

  // Lazy first-load — calls back once when the parent hasn't pre-loaded.
  (0, _react.useEffect)(() => {
    if (status === 'idle') onFirstOpen?.();
    // We intentionally depend only on `status`; if the parent flips status
    // back to idle (rare), we re-trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  if (!refreshing && status === 'ready' && actions.length === 0) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.root,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_EmptyState.EmptyState, {
        theme: theme,
        title: t('tab.activity'),
        body: t('empty.activity'),
        glyph: "\u2022"
      })
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
    style: styles.root,
    contentContainerStyle: styles.scroll,
    refreshControl: onRefresh ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.RefreshControl, {
      refreshing: refreshing === true,
      onRefresh: onRefresh,
      tintColor: theme.colors.primary
    }) : undefined,
    onScroll: ({
      nativeEvent
    }) => {
      if (!onLoadMore || !hasMore) return;
      const {
        contentOffset,
        contentSize,
        layoutMeasurement
      } = nativeEvent;
      const distanceToEnd = contentSize.height - contentOffset.y - layoutMeasurement.height;
      if (distanceToEnd < 240) onLoadMore();
    },
    scrollEventThrottle: 200,
    children: actions.map(a => /*#__PURE__*/(0, _jsxRuntime.jsx)(Row, {
      theme: theme,
      t: t,
      action: a,
      onPress: onActionPress ? () => onActionPress(a) : undefined
    }, a.id))
  });
}

// ---------------------------------------------------------------------------

function Row(props) {
  const {
    theme,
    t,
    action,
    onPress
  } = props;
  const styles = rowStyles(theme);
  const occurred = action.completed_at ?? action.created_at;
  const relParts = (0, _time.relativeParts)(occurred);
  const statusKey = action.status === 'completed' ? 'status.completed' : action.status === 'failed' ? 'status.failed' : 'status.pending';
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
    onPress: onPress,
    disabled: !onPress,
    style: ({
      pressed
    }) => [styles.row, pressed && styles.pressed],
    accessibilityRole: onPress ? 'button' : 'text',
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: styles.body,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.title,
        children: humanOperation(action.target_operation)
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: styles.metaRow,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.metaAgent,
          children: action.agent_id
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.metaDot,
          children: " \xB7 "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.metaTime,
          children: (0, _time.formatRelative)(relParts, t)
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.metaDot,
          children: " \xB7 "
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: [styles.metaStatus, action.status === 'failed' ? styles.metaStatusFail : styles.metaStatusOk],
          children: t(statusKey)
        })]
      }), action.status === 'failed' && action.error_code ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.errorCode,
        children: action.error_code
      }) : null]
    })
  });
}

/**
 * Light cosmetic transform of `klokd.write.shift_pay` →
 * `klokd · write · shift pay`. The Console doesn't have access to the
 * scope catalogue display names for the operation column; this gives the
 * user something readable until the catalogue lookup is added (parity
 * with how `formatScopeLimit` uses `scope_id` as a fallback name).
 */
function humanOperation(op) {
  return op.replaceAll('_', ' ').replaceAll('.', ' · ');
}
function makeStyles(theme) {
  return _reactNative.StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    scroll: {
      padding: theme.spacing.md
    }
  });
}
function rowStyles(theme) {
  return _reactNative.StyleSheet.create({
    row: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    pressed: {
      opacity: 0.92
    },
    body: {
      flex: 1
    },
    title: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
      fontFamily: theme.typography.fontFamily
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 4
    },
    metaAgent: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily
    },
    metaDot: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted
    },
    metaTime: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily
    },
    metaStatus: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.5,
      fontFamily: theme.typography.fontFamily
    },
    metaStatusOk: {
      color: theme.colors.success
    },
    metaStatusFail: {
      color: theme.colors.danger
    },
    errorCode: {
      marginTop: 4,
      fontSize: theme.typography.caption,
      color: theme.colors.danger,
      fontFamily: theme.typography.fontFamily
    }
  });
}
//# sourceMappingURL=ActivityTab.js.map