"use strict";

/**
 * Console empty state — shown in any tab whose list is empty.
 *
 * Per Console spec §3.6 — each tab has its own empty copy ("No active
 * authorities…" / "Agents acting on your behalf will show up here." /
 * "Revoked or expired permissions will be listed here."). This component
 * is the layout container; callers pass the strings + an optional emoji
 * glyph so we don't bring an icon library into the rail-side foundation.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState(props) {
  const {
    theme,
    title,
    body,
    glyph
  } = props;
  const styles = makeStyles(theme);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.root,
    accessibilityRole: "text",
    children: [glyph !== undefined ? /*#__PURE__*/_jsx(View, {
      style: styles.glyphRing,
      children: /*#__PURE__*/_jsx(Text, {
        style: styles.glyph,
        children: glyph
      })
    }) : null, /*#__PURE__*/_jsx(Text, {
      style: styles.title,
      children: title
    }), /*#__PURE__*/_jsx(Text, {
      style: styles.body,
      children: body
    })]
  });
}
function makeStyles(theme) {
  return StyleSheet.create({
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