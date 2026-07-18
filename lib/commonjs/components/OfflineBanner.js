"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OfflineBanner = OfflineBanner;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Console offline banner — fixed-position notice when the device is offline.
 *
 * Per spec §4.5: "Showing your last-cached state. Some actions are
 * unavailable offline." Reads succeed from cache; revoke needs network.
 * This component is the visual; the `offline` boolean lives on the
 * `consoleReducer` state and is driven by the consuming app's connectivity
 * watcher (RN NetInfo or equivalent — we don't import it here to keep the
 * library connectivity-agnostic).
 */

function OfflineBanner(props) {
  const {
    theme,
    visible,
    label
  } = props;
  if (!visible) return null;
  const styles = makeStyles(theme);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: styles.root,
    accessibilityRole: "alert",
    accessibilityLiveRegion: "polite",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.dot
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: styles.label,
      children: label
    })]
  });
}
function makeStyles(theme) {
  return _reactNative.StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.warning,
      gap: theme.spacing.sm
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.onPrimary
    },
    label: {
      flex: 1,
      color: theme.colors.onPrimary,
      fontSize: theme.typography.caption,
      fontWeight: '600',
      fontFamily: theme.typography.fontFamily
    }
  });
}
//# sourceMappingURL=OfflineBanner.js.map