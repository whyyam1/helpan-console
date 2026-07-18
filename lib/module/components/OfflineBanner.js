"use strict";

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

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function OfflineBanner(props) {
  const {
    theme,
    visible,
    label
  } = props;
  if (!visible) return null;
  const styles = makeStyles(theme);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.root,
    accessibilityRole: "alert",
    accessibilityLiveRegion: "polite",
    children: [/*#__PURE__*/_jsx(View, {
      style: styles.dot
    }), /*#__PURE__*/_jsx(Text, {
      style: styles.label,
      children: label
    })]
  });
}
function makeStyles(theme) {
  return StyleSheet.create({
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