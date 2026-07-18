"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmptyState = EmptyState;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Console empty state — shown in any tab whose list is empty.
 *
 * Per Console spec §3.6 — each tab has its own empty copy ("No active
 * authorities…" / "Agents acting on your behalf will show up here." /
 * "Revoked or expired permissions will be listed here."). This component
 * is the layout container; callers pass the strings + an optional emoji
 * glyph so we don't bring an icon library into the rail-side foundation.
 */

function EmptyState(props) {
  const {
    theme,
    title,
    body,
    glyph
  } = props;
  const styles = makeStyles(theme);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: styles.root,
    accessibilityRole: "text",
    children: [glyph !== undefined ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.glyphRing,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.glyph,
        children: glyph
      })
    }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.title,
      children: title
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.body,
      children: body
    })]
  });
}
function makeStyles(theme) {
  return _reactNative.StyleSheet.create({
    root: {
      paddingVertical: 60,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center'
    },
    glyphRing: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md
    },
    glyph: {
      fontSize: 26,
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily
    },
    title: {
      fontSize: theme.typography.title,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center'
    },
    body: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
      fontFamily: theme.typography.fontFamily
    }
  });
}
//# sourceMappingURL=EmptyState.js.map