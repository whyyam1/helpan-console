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
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';

export interface BehaviouralFrictionScreenProps {
  readonly theme: ConsoleTheme;
  readonly t: Translator;
  readonly onContinue: () => void;
  readonly onCancel: () => void;
}

export function BehaviouralFrictionScreen(
  props: BehaviouralFrictionScreenProps
): React.JSX.Element {
  const { theme, t, onContinue, onCancel } = props;
  const styles = makeStyles(theme);
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconGlyph}>!</Text>
        </View>
        <Text style={styles.title}>{t('friction.title')}</Text>
        <Text style={styles.body}>{t('friction.body')}</Text>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => [
            styles.btn,
            styles.btnCancel,
            pressed && styles.btnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('common.cancel')}
        >
          <Text style={styles.btnCancelText}>{t('common.cancel')}</Text>
        </Pressable>
        <Pressable
          onPress={onContinue}
          style={({ pressed }) => [
            styles.btn,
            styles.btnPrimary,
            pressed && styles.btnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('friction.continue')}
        >
          <Text style={styles.btnPrimaryText}>{t('friction.continue')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    scroll: {
      flexGrow: 1,
      padding: theme.spacing.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.accent,
      opacity: 0.15,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: theme.spacing.lg,
    },
    iconGlyph: {
      fontSize: 36,
      fontWeight: '700' as const,
      color: theme.colors.accent,
      opacity: 1,
      fontFamily: theme.typography.fontFamily,
    },
    title: {
      fontSize: theme.typography.heading,
      fontWeight: '700' as const,
      color: theme.colors.text,
      textAlign: 'center' as const,
      marginBottom: theme.spacing.md,
      fontFamily: theme.typography.fontFamily,
    },
    body: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      lineHeight: 22,
      textAlign: 'center' as const,
      fontFamily: theme.typography.fontFamily,
    },
    footer: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    btn: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    btnPressed: { opacity: 0.85 },
    btnCancel: { backgroundColor: theme.colors.background },
    btnPrimary: { backgroundColor: theme.colors.primary },
    btnCancelText: {
      fontSize: theme.typography.body,
      fontWeight: '600' as const,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
    },
    btnPrimaryText: {
      fontSize: theme.typography.body,
      fontWeight: '700' as const,
      color: theme.colors.onPrimary,
      fontFamily: theme.typography.fontFamily,
    },
  });
}
