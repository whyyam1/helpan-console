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

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { ConsoleTheme } from '../theme/tokens.js';

export type TabKey = 'active' | 'activity' | 'history';

export interface TabConfig {
  readonly key: TabKey;
  readonly label: string;
  /** Optional count badge (e.g. number of active authorities). */
  readonly badge?: number;
}

export interface TabsProps {
  readonly theme: ConsoleTheme;
  readonly tabs: readonly TabConfig[];
  readonly value: TabKey;
  readonly onChange: (next: TabKey) => void;
}

export function Tabs(props: TabsProps): React.JSX.Element {
  const { theme, tabs, value, onChange } = props;
  const styles = makeStyles(theme);
  return (
    <View style={styles.root} accessibilityRole="tablist">
      {tabs.map((t) => {
        const selected = t.key === value;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={t.badge ? `${t.label}, ${t.badge}` : t.label}
            style={({ pressed }) => [
              styles.tab,
              pressed && styles.tabPressed,
            ]}
          >
            <Text style={selected ? styles.labelActive : styles.labelMuted}>
              {t.label}
              {t.badge !== undefined && t.badge > 0 ? (
                <Text style={selected ? styles.badgeActive : styles.badgeMuted}>
                  {`  ${t.badge}`}
                </Text>
              ) : null}
            </Text>
            {selected ? <View style={styles.underline} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: {
      flexDirection: 'row' as const,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      alignItems: 'center' as const,
      position: 'relative' as const,
    },
    tabPressed: {
      opacity: 0.7,
    },
    labelActive: {
      fontSize: theme.typography.body,
      fontWeight: '700' as const,
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily,
    },
    labelMuted: {
      fontSize: theme.typography.body,
      fontWeight: '600' as const,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily,
    },
    badgeActive: {
      fontSize: theme.typography.caption,
      color: theme.colors.primary,
      fontWeight: '700' as const,
    },
    badgeMuted: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontWeight: '600' as const,
    },
    underline: {
      position: 'absolute' as const,
      left: '20%' as const,
      right: '20%' as const,
      bottom: 0,
      height: 3,
      borderRadius: 2,
      backgroundColor: theme.colors.primary,
    },
  });
}
