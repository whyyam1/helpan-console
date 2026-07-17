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

import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';

export interface RevokeConfirmModalProps {
  readonly theme: ConsoleTheme;
  readonly t: Translator;
  readonly visible: boolean;
  readonly agentName: string;
  readonly isRevoking: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function RevokeConfirmModal(
  props: RevokeConfirmModalProps
): React.JSX.Element {
  const { theme, t, visible, agentName, isRevoking, onConfirm, onCancel } = props;
  const styles = makeStyles(theme);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel} accessibilityRole="button" />
      <View
        style={styles.sheet}
        accessibilityRole="alert"
        accessibilityLabel={t('revoke.title')}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconGlyph}>!</Text>
        </View>
        <Text style={styles.title}>{t('revoke.title')}</Text>
        <Text style={styles.agent}>{agentName}</Text>
        <Text style={styles.body}>{t('revoke.body')}</Text>
        <Text style={styles.inflight}>{t('revoke.inflight')}</Text>
        <View style={styles.row}>
          <Pressable
            onPress={onCancel}
            disabled={isRevoking}
            style={({ pressed }) => [
              styles.btn,
              styles.btnCancel,
              pressed && styles.btnPressed,
              isRevoking && styles.btnDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t('common.cancel')}
          >
            <Text style={styles.btnCancelText}>{t('common.cancel')}</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            disabled={isRevoking}
            style={({ pressed }) => [
              styles.btn,
              styles.btnDanger,
              pressed && styles.btnPressed,
              isRevoking && styles.btnDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t('revoke.confirm')}
          >
            {isRevoking ? (
              <ActivityIndicator color={theme.colors.onDanger} />
            ) : (
              <Text style={styles.btnDangerText}>{t('revoke.confirm')}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    sheet: {
      position: 'absolute' as const,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      alignItems: 'center' as const,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.danger,
      opacity: 0.12,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: theme.spacing.md,
    },
    iconGlyph: {
      fontSize: 26,
      fontWeight: '700' as const,
      color: theme.colors.danger,
      opacity: 1,
      fontFamily: theme.typography.fontFamily,
    },
    title: {
      fontSize: theme.typography.title,
      fontWeight: '700' as const,
      color: theme.colors.text,
      textAlign: 'center' as const,
      fontFamily: theme.typography.fontFamily,
    },
    agent: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.md,
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center' as const,
    },
    body: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      lineHeight: 22,
      textAlign: 'center' as const,
      fontFamily: theme.typography.fontFamily,
    },
    inflight: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      lineHeight: 18,
      marginTop: theme.spacing.sm,
      textAlign: 'center' as const,
      fontFamily: theme.typography.fontFamily,
    },
    row: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
      alignSelf: 'stretch' as const,
    },
    btn: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    btnPressed: { opacity: 0.85 },
    btnDisabled: { opacity: 0.6 },
    btnCancel: { backgroundColor: theme.colors.background },
    btnDanger: { backgroundColor: theme.colors.danger },
    btnCancelText: {
      fontSize: theme.typography.body,
      fontWeight: '600' as const,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
    },
    btnDangerText: {
      fontSize: theme.typography.body,
      fontWeight: '700' as const,
      color: theme.colors.onDanger,
      fontFamily: theme.typography.fontFamily,
    },
  });
}
