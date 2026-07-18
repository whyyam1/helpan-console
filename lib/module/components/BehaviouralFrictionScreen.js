"use strict";

/**
 * Behavioural-data friction screen (spec §4.2).
 *
 * Shown BEFORE the grant flow when the requested scope set includes ANY
 * `read_behavioural` category scope (e.g. `chapaa.read.behavioural`). The
 * user must explicitly press Continue to proceed to the standard grant
 * flow — which then ALSO requires step-up (spec §4.3). Two gates total.
 *
 * Intentionally not skippable. The Continue button is the only progressive
 * affordance; Cancel pops the modal stack. This is the regulator-friendly
 * proof that the user crossed a deliberate gate for sensitive data.
 *
 * The body copy lists the kinds of behavioural detail (savings cadence,
 * withdrawal patterns, goal completions) — comes from `i18n: friction.body`.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function BehaviouralFrictionScreen(props) {
  const {
    theme,
    t,
    onContinue,
    onCancel
  } = props;
  const styles = makeStyles(theme);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.root,
    children: [/*#__PURE__*/_jsxs(ScrollView, {
      contentContainerStyle: styles.scroll,
      children: [/*#__PURE__*/_jsx(View, {
        style: styles.iconCircle,
        children: /*#__PURE__*/_jsx(Text, {
          style: styles.iconGlyph,
          children: "!"
        })
      }), /*#__PURE__*/_jsx(Text, {
        style: styles.title,
        children: t('friction.title')
      }), /*#__PURE__*/_jsx(Text, {
        style: styles.body,
        children: t('friction.body')
      })]
    }), /*#__PURE__*/_jsxs(View, {
      style: styles.footer,
      children: [/*#__PURE__*/_jsx(Pressable, {
        onPress: onCancel,
        style: ({
          pressed
        }) => [styles.btn, styles.btnCancel, pressed && styles.btnPressed],
        accessibilityRole: "button",
        accessibilityLabel: t('common.cancel'),
        children: /*#__PURE__*/_jsx(Text, {
          style: styles.btnCancelText,
          children: t('common.cancel')
        })
      }), /*#__PURE__*/_jsx(Pressable, {
        onPress: onContinue,
        style: ({
          pressed
        }) => [styles.btn, styles.btnPrimary, pressed && styles.btnPressed],
        accessibilityRole: "button",
        accessibilityLabel: t('friction.continue'),
        children: /*#__PURE__*/_jsx(Text, {
          style: styles.btnPrimaryText,
          children: t('friction.continue')
        })
      })]
    })]
  });
}
function makeStyles(theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.surface
    },
    scroll: {
      flexGrow: 1,
      padding: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.accent,
      opacity: 0.15,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg
    },
    iconGlyph: {
      fontSize: 36,
      fontWeight: '700',
      color: theme.colors.accent,
      opacity: 1,
      fontFamily: theme.typography.fontFamily
    },
    title: {
      fontSize: theme.typography.heading,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      fontFamily: theme.typography.fontFamily
    },
    body: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      lineHeight: 22,
      textAlign: 'center',
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
//# sourceMappingURL=BehaviouralFrictionScreen.js.map