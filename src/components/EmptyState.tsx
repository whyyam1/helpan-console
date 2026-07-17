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
import type { ConsoleTheme } from '../theme/tokens.js';

export interface EmptyStateProps {
  readonly theme: ConsoleTheme;
  readonly title: string;
  readonly body: string;
  /** Optional small emoji / single-char glyph rendered above the title. */
  readonly glyph?: string;
}

export function EmptyState(props: EmptyStateProps): React.JSX.Element {
  const { theme, title, body, glyph } = props;
  const styles = makeStyles(theme);
  return (
    <View style={styles.root} accessibilityRole="text">
      {glyph !== undefined ? (
        <View style={styles.glyphRing}>
          <Text style={styles.glyph}>{glyph}</Text>
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: {
      paddingVertical: 60,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center' as const,
    },
    glyphRing: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: theme.spacing.md,
    },
    glyph: {
      fontSize: 26,
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily,
    },
    title: {
      fontSize: theme.typography.title,
      fontWeight: '600' as const,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center' as const,
    },
    body: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      textAlign: 'center' as const,
      lineHeight: 20,
      fontFamily: theme.typography.fontFamily,
    },
  });
}
