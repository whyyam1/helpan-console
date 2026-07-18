"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthorityDetail = AuthorityDetail;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _AuthorityCard = require("../components/AuthorityCard.js");
var _time = require("../format/time.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Authority detail screen (spec §3.3).
 *
 * Full authority view (AuthorityCard variant) + recent actions filtered
 * to this authority's jti. The Revoke action lives at the bottom under
 * the actions list so the user reads what the agent has done before
 * tapping revoke.
 *
 * Step-up isn't shown explicitly (spec §3.3 mentions step_up_token JTI as
 * "informational, audit-friendly" — kept off the v1.0 surface).
 */

function AuthorityDetail(props) {
  const {
    theme,
    t,
    lang,
    authority,
    catalogue,
    actions,
    isRevoking,
    onRevoke,
    maxActions = 30
  } = props;
  const styles = makeStyles(theme);
  const own = (0, _react.useMemo)(() => actions.filter(a => a.delegated_authority_jti === authority.id).slice(0, maxActions), [actions, authority.id, maxActions]);

  // The component re-uses AuthorityCard with hideActions; the screen owns
  // a single Revoke button at the bottom so it's always reachable below
  // the actions list (which can be long).
  void isRevoking;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
    style: styles.root,
    contentContainerStyle: styles.scroll,
    accessibilityRole: "summary",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AuthorityCard.AuthorityCard, {
      theme: theme,
      t: t,
      lang: lang,
      authority: authority,
      ...(catalogue ? {
        catalogue
      } : {}),
      ...(onRevoke ? {
        onRevoke
      } : {}),
      hideActions: authority.status !== 'active'
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.section,
      children: t('tab.activity')
    }), own.length === 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.bodyMuted,
      children: t('empty.activity')
    }) : own.map(a => {
      const rel = (0, _time.relativeParts)(a.completed_at ?? a.created_at);
      const statusKey = a.status === 'completed' ? 'status.completed' : a.status === 'failed' ? 'status.failed' : 'status.pending';
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: styles.actionRow,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.actionTitle,
          children: a.target_operation
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, {
          style: styles.actionMeta,
          children: [(0, _time.formatRelative)(rel, t), " \xB7 ", t(statusKey), a.error_code ? ` · ${a.error_code}` : '']
        })]
      }, a.id);
    })]
  });
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
    section: {
      fontSize: theme.typography.caption,
      fontWeight: '700',
      letterSpacing: 1.4,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase',
      fontFamily: theme.typography.fontFamily
    },
    bodyMuted: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      fontStyle: 'italic',
      paddingVertical: theme.spacing.md,
      fontFamily: theme.typography.fontFamily
    },
    actionRow: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.sm,
      marginBottom: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    actionTitle: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      fontWeight: '500',
      fontFamily: theme.typography.fontFamily
    },
    actionMeta: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      marginTop: 2,
      fontFamily: theme.typography.fontFamily
    }
  });
}
//# sourceMappingURL=AuthorityDetail.js.map