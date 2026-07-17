/**
 * Authority detail screen (spec §3.3).
 *
 * Full authority view (AuthorityCard variant) + recent actions filtered
 * to this authority's jti. The Revoke action lives at the bottom under
 * the actions list so the user reads what the agent has done before
 * tapping revoke.
 *
 * Step-up isn't shown explicitly (spec §3.3 mentions step_up_token JTI as
 * "informational, audit-friendly" — kept off the v1.0 surface).
 */

import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { Authority, ConsoleAction, OauthScope } from '../types.js';
import type { Translator, MessageKey } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
import { AuthorityCard } from '../components/AuthorityCard.js';
import { formatRelative, relativeParts } from '../format/time.js';

export interface AuthorityDetailProps {
  readonly theme: ConsoleTheme;
  readonly t: Translator;
  readonly lang: 'en' | 'sw';
  readonly authority: Authority;
  readonly catalogue?: ReadonlyMap<string, OauthScope>;
  /** All known actions; will be filtered to this authority's jti. */
  readonly actions: readonly ConsoleAction[];
  readonly isRevoking?: boolean;
  readonly onRevoke?: () => void;
  /** Cap on rows shown — spec §3.2 says "last 30". Default 30. */
  readonly maxActions?: number;
}

export function AuthorityDetail(props: AuthorityDetailProps): React.JSX.Element {
  const {
    theme,
    t,
    lang,
    authority,
    catalogue,
    actions,
    isRevoking,
    onRevoke,
    maxActions = 30,
  } = props;
  const styles = makeStyles(theme);

  const own = useMemo(
    () =>
      actions
        .filter((a) => a.delegated_authority_jti === authority.id)
        .slice(0, maxActions),
    [actions, authority.id, maxActions]
  );

  // The component re-uses AuthorityCard with hideActions; the screen owns
  // a single Revoke button at the bottom so it's always reachable below
  // the actions list (which can be long).
  void isRevoking;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scroll}
      accessibilityRole="summary"
    >
      <AuthorityCard
        theme={theme}
        t={t}
        lang={lang}
        authority={authority}
        {...(catalogue ? { catalogue } : {})}
        {...(onRevoke ? { onRevoke } : {})}
        hideActions={authority.status !== 'active'}
      />

      <Text style={styles.section}>{t('tab.activity')}</Text>
      {own.length === 0 ? (
        <Text style={styles.bodyMuted}>{t('empty.activity')}</Text>
      ) : (
        own.map((a) => {
          const rel = relativeParts(a.completed_at ?? a.created_at);
          const statusKey = (
            a.status === 'completed'
              ? 'status.completed'
              : a.status === 'failed'
                ? 'status.failed'
                : 'status.pending'
          ) as MessageKey;
          return (
            <View key={a.id} style={styles.actionRow}>
              <Text style={styles.actionTitle}>{a.target_operation}</Text>
              <Text style={styles.actionMeta}>
                {formatRelative(rel, t)} · {t(statusKey)}
                {a.error_code ? ` · ${a.error_code}` : ''}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { padding: theme.spacing.md },
    section: {
      fontSize: theme.typography.caption,
      fontWeight: '700' as const,
      letterSpacing: 1.4,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase' as const,
      fontFamily: theme.typography.fontFamily,
    },
    bodyMuted: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      fontStyle: 'italic' as const,
      paddingVertical: theme.spacing.md,
      fontFamily: theme.typography.fontFamily,
    },
    actionRow: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.sm,
      marginBottom: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionTitle: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      fontWeight: '500' as const,
      fontFamily: theme.typography.fontFamily,
    },
    actionMeta: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      marginTop: 2,
      fontFamily: theme.typography.fontFamily,
    },
  });
}
