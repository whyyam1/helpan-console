"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tabs = Tabs;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Console top-level tabs — Active / Activity / History (spec §3.1).
 *
 * Pure controlled component. The parent owns the selected tab; this
 * component is the visual + accessibility surface only. Active gets a
 * count badge by default (every tab can opt in via `badge`).
 *
 * Visual: the active tab has an underline accent in `colors.primary`;
 * inactive tabs render in muted text. Spec §3.1 calls the underline a
 * "design polish" not a semantic — the primary affordance is the colour
 * shift, accessible via `accessibilityState.selected`.
 */

function Tabs(props) {
  const {
    theme,
    tabs,
    value,
    onChange
  } = props;
  const styles = makeStyles(theme);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: styles.root,
    accessibilityRole: "tablist",
    children: tabs.map(t => {
      const selected = t.key === value;
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Pressable, {
        onPress: () => onChange(t.key),
        accessibilityRole: "tab",
        accessibilityState: {
          selected
        },
        accessibilityLabel: t.badge ? `${t.label}, ${t.badge}` : t.label,
        style: ({
          pressed
        }) => [styles.tab, pressed && styles.tabPressed],
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Text, {
          style: selected ? styles.labelActive : styles.labelMuted,
          children: [t.label, t.badge !== undefined && t.badge > 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: selected ? styles.badgeActive : styles.badgeMuted,
            children: `  ${t.badge}`
          }) : null]
        }), selected ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: styles.underline
        }) : null]
      }, t.key);
    })
  });
}
function makeStyles(theme) {
  return _reactNative.StyleSheet.create({
    root: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      alignItems: 'center',
      position: 'relative'
    },
    tabPressed: {
      opacity: 0.7
    },
    labelActive: {
      fontSize: theme.typography.body,
      fontWeight: '700',
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily
    },
    labelMuted: {
      fontSize: theme.typography.body,
      fontWeight: '600',
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily
    },
    badgeActive: {
      fontSize: theme.typography.caption,
      color: theme.colors.primary,
      fontWeight: '700'
    },
    badgeMuted: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontWeight: '600'
    },
    underline: {
      position: 'absolute',
      left: '20%',
      right: '20%',
      bottom: 0,
      height: 3,
      borderRadius: 2,
      backgroundColor: theme.colors.primary
    }
  });
}
//# sourceMappingURL=Tabs.js.map