"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GrantFlow = GrantFlow;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _BehaviouralFrictionScreen = require("../components/BehaviouralFrictionScreen.js");
var _ScopeList = require("../components/ScopeList.js");
var _scopes = require("../format/scopes.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Grant flow screen (spec §4 — friction + confirm).
 *
 * Three phases, owned by this screen as local state:
 *
 *   1. friction — shown ONLY when the proposed scope set contains any
 *      `read_behavioural` scope (Console spec §4.2; rail tags this via
 *      `oauth_scopes.category='read_behavioural'`). Renders
 *      `BehaviouralFrictionScreen`; user taps Continue → phase 2.
 *
 *   2. confirm — the standard grant flow. Renders the proposed scopes via
 *      `ScopeList`, shows the agent name + TTL summary, and a Confirm
 *      button. Tapping Confirm calls `onConfirm(req)` and transitions to
 *      `submitting`.
 *
 *   3. submitting — disables the Confirm button + shows the inflight
 *      hint. The parent is expected to resolve back to the previous
 *      screen on success (or hand back an error that the screen surfaces
 *      via the `error` prop).
 *
 * Step-up is owned by the parent: when the proposed scope set requires
 * step-up (rail tags this via `default_grantable=false`), the parent is
 * expected to interleave the Identiti step-up flow BEFORE calling
 * `onConfirm`. The Console doesn't drive step-up directly to keep its
 * surface area small.
 */

function GrantFlow(props) {
  const {
    theme,
    t,
    accountUuid,
    agentId,
    agentDisplayName,
    proposedScopes,
    ttlSeconds,
    catalogue,
    stepUpToken,
    submitting,
    error,
    onConfirm,
    onCancel
  } = props;
  const styles = makeStyles(theme);
  const hasBehavioural = (0, _react.useMemo)(() => proposedScopes.some(s => (0, _scopes.isBehaviouralScopeId)(s.scope_id, catalogue)), [proposedScopes, catalogue]);
  const [phase, setPhase] = (0, _react.useState)(hasBehavioural ? 'friction' : 'confirm');
  if (phase === 'friction') {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_BehaviouralFrictionScreen.BehaviouralFrictionScreen, {
      theme: theme,
      t: t,
      onContinue: () => setPhase('confirm'),
      onCancel: onCancel
    });
  }
  const submit = () => {
    const req = {
      account_uuid: accountUuid,
      agent_id: agentId,
      scopes: proposedScopes.map(s => ({
        ...s
      })),
      ttl_seconds: ttlSeconds,
      ...(stepUpToken ? {
        step_up_token: stepUpToken
      } : {})
    };
    onConfirm(req);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: styles.root,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.ScrollView, {
      contentContainerStyle: styles.scroll,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.title,
        children: t('grant.title')
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.agent,
        children: agentDisplayName
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ScopeList.ScopeList, {
        theme: theme,
        t: t,
        scopes: proposedScopes,
        ...(catalogue ? {
          catalogue
        } : {})
      }), error ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.error,
        children: error
      }) : null]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: styles.footer,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        onPress: onCancel,
        disabled: submitting,
        style: ({
          pressed
        }) => [styles.btn, styles.btnCancel, pressed && styles.btnPressed, submitting && styles.btnDisabled],
        accessibilityRole: "button",
        accessibilityLabel: t('common.cancel'),
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.btnCancelText,
          children: t('common.cancel')
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
        onPress: submit,
        disabled: submitting,
        style: ({
          pressed
        }) => [styles.btn, styles.btnPrimary, pressed && styles.btnPressed, submitting && styles.btnDisabled],
        accessibilityRole: "button",
        accessibilityLabel: t('grant.confirm'),
        children: submitting ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
          color: theme.colors.onPrimary
        }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.btnPrimaryText,
          children: t('grant.confirm')
        })
      })]
    })]
  });
}
function makeStyles(theme) {
  return _reactNative.StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.surface
    },
    scroll: {
      padding: theme.spacing.lg
    },
    title: {
      fontSize: theme.typography.heading,
      fontWeight: '700',
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily
    },
    agent: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
      fontFamily: theme.typography.fontFamily
    },
    error: {
      marginTop: theme.spacing.md,
      color: theme.colors.danger,
      fontSize: theme.typography.body,
      fontFamily: theme.typography.fontFamily
    },
    footer: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface
    },
    btn: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center'
    },
    btnPressed: {
      opacity: 0.85
    },
    btnDisabled: {
      opacity: 0.6
    },
    btnCancel: {
      backgroundColor: theme.colors.background
    },
    btnPrimary: {
      backgroundColor: theme.colors.primary
    },
    btnCancelText: {
      fontSize: theme.typography.body,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily
    },
    btnPrimaryText: {
      fontSize: theme.typography.body,
      fontWeight: '700',
      color: theme.colors.onPrimary,
      fontFamily: theme.typography.fontFamily
    }
  });
}
//# sourceMappingURL=GrantFlow.js.map