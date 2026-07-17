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
import type { ConsoleTheme } from '../theme/tokens.js';

export interface OfflineBannerProps {
  readonly theme: ConsoleTheme;
  readonly visible: boolean;
  readonly label: string;
}

export function OfflineBanner(props: OfflineBannerProps): React.JSX.Element | null {
  const { theme, visible, label } = props;
  if (!visible) return null;
  const styles = makeStyles(theme);
  return (
    <View
      style={styles.root}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.dot} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.warning,
      gap: theme.spacing.sm,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.onPrimary,
    },
    label: {
      flex: 1,
      color: theme.colors.onPrimary,
      fontSize: theme.typography.caption,
      fontWeight: '600' as const,
      fontFamily: theme.typography.fontFamily,
    },
  });
}
