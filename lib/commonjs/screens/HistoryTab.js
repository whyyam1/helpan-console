"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HistoryTab = HistoryTab;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _AuthorityCard = require("../components/AuthorityCard.js");
var _EmptyState = require("../components/EmptyState.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * History tab — revoked / expired authorities (spec §3.5).
 *
 * Same `AuthorityCard` component as Active, but rendered with
 * `hideActions=true` and a reason chip below the status pill ("You revoked
 * this" / "Expired" / "Revoked because your account was suspended"). The
 * reason copy comes from the i18n catalogue keyed on
 * `authority.revocation_reason`, with `expired` as a synthetic fallback
 * when `status='expired'` and there's no explicit reason.
 */

function HistoryTab(props) {
  const {
    theme,
    t,
    lang,
    authorities,
    catalogue,
    refreshing,
    onRefresh
  } = props;
  const styles = makeStyles(theme);
  if (!refreshing && authorities.length === 0) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.root,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_EmptyState.EmptyState, {
        theme: theme,
        title: t('tab.history'),
        body: t('empty.history'),
        glyph: "\u2715"
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
    children: authorities.map(a => /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AuthorityCard.AuthorityCard, {
        theme: theme,
        t: t,
        lang: lang,
        authority: a,
        ...(catalogue ? {
          catalogue
        } : {}),
        hideActions: true
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: styles.reasonRow,
        accessibilityRole: "text",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, {
          style: styles.reasonLabel,
          children: [t('history.endedOn'), ": "]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.reasonText,
          children: reasonLine(a, t)
        })]
      })]
    }, a.id))
  });
}
function reasonLine(a, t) {
  const reasonKey = a.revocation_reason ? `reason.${a.revocation_reason}` : a.status === 'expired' ? 'reason.expired' : 'reason.other';
  return t(reasonKey);
}
function makeStyles(theme) {
  return _reactNative.StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    scroll: {
      padding: theme.spacing.md
    },
    reasonRow: {
      marginTop: -theme.spacing.sm,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center'
    },
    reasonLabel: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontWeight: '600',
      fontFamily: theme.typography.fontFamily
    },
    reasonText: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily,
      flex: 1
    }
  });
}
//# sourceMappingURL=HistoryTab.js.map