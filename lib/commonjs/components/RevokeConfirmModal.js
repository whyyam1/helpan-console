"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RevokeConfirmModal = RevokeConfirmModal;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Revoke confirmation modal (spec §4.1).
 *
 * Bottom-sheet style on mobile, centered on tablet/web. ONE confirm screen
 * — the spec is explicit: "No multi-step 'are you sure' sequences.
 * Revocation is a positive user act and friction is wrong here." The
 * modal shows:
 *
 *   1. Agent name (so the user knows what they're revoking)
 *   2. What revocation does (i18n: revoke.body)
 *   3. The in-flight clause (i18n: revoke.inflight)
 *   4. [Cancel] [Confirm Revoke]
 *
 * The confirm button uses `colors.danger` semantically — even under a
 * rebranded theme, revoke is always the destructive colour (spec §8:
 * "the Console's semantic UI is preserved").
 *
 * Inflight state: when `isRevoking=true`, the confirm button is disabled
 * and labelled with the spinner glyph. The caller drives this from
 * `isRevoking(state, authorityId)` on the reducer.
 */

function RevokeConfirmModal(props) {
  const {
    theme,
    t,
    visible,
    agentName,
    isRevoking,
    onConfirm,
    onCancel
  } = props;
  const styles = makeStyles(theme);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.Modal, {
    visible: visible,
    transparent: true,
    animationType: "slide",
    onRequestClose: onCancel,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
      style: styles.backdrop,
      onPress: onCancel,
      accessibilityRole: "button"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: styles.sheet,
      accessibilityRole: "alert",
      accessibilityLabel: t('revoke.title'),
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
        style: styles.iconCircle,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: styles.iconGlyph,
          children: "!"
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.title,
        children: t('revoke.title')
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.agent,
        children: agentName
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.body,
        children: t('revoke.body')
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: styles.inflight,
        children: t('revoke.inflight')
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: styles.row,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
          onPress: onCancel,
          disabled: isRevoking,
          style: ({
            pressed
          }) => [styles.btn, styles.btnCancel, pressed && styles.btnPressed, isRevoking && styles.btnDisabled],
          accessibilityRole: "button",
          accessibilityLabel: t('common.cancel'),
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: styles.btnCancelText,
            children: t('common.cancel')
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
          onPress: onConfirm,
          disabled: isRevoking,
          style: ({
            pressed
          }) => [styles.btn, styles.btnDanger, pressed && styles.btnPressed, isRevoking && styles.btnDisabled],
          accessibilityRole: "button",
          accessibilityLabel: t('revoke.confirm'),
          children: isRevoking ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {
            color: theme.colors.onDanger
          }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: styles.btnDangerText,
            children: t('revoke.confirm')
          })
        })]
      })]
    })]
  });
}
function makeStyles(theme) {
  return _reactNative.StyleSheet.create({
    backdrop: {
      ..._reactNative.StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.45)'
    },
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      alignItems: 'center'
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.danger,
      opacity: 0.12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md
    },
    iconGlyph: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.danger,
      opacity: 1,
      fontFamily: theme.typography.fontFamily
    },
    title: {
      fontSize: theme.typography.title,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily
    },
    agent: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.md,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center'
    },
    body: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      lineHeight: 22,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily
    },
    inflight: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      lineHeight: 18,
      marginTop: theme.spacing.sm,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
      alignSelf: 'stretch'
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
    btnDanger: {
      backgroundColor: theme.colors.danger
    },
    btnCancelText: {
      fontSize: theme.typography.body,
      fontWeight: '600',
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily
    },
    btnDangerText: {
      fontSize: theme.typography.body,
      fontWeight: '700',
      color: theme.colors.onDanger,
      fontFamily: theme.typography.fontFamily
    }
  });
}
//# sourceMappingURL=RevokeConfirmModal.js.map