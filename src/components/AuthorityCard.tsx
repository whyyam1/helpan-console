/**
 * Console authority card (spec §3.2).
 *
 * One card per authority on the Active tab; same component is reused on
 * the AuthorityDetail screen with `compact={false}` to render the larger
 * variant.
 *
 * Fields (spec §3.2):
 *   • Agent name + small status pill (Active / Expired / Revoked)
 *   • Granted on / Expires / Last used — three columns of meta
 *   • ScopeList — the human-readable scope rows
 *   • Quick actions: Revoke (danger semantics) + View activity
 *
 * The Revoke button is ALWAYS danger-coloured regardless of theme rebrand
 * (spec §8 semantic invariant). The View activity button uses the muted
 * neutral background — secondary affordance.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Authority, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
import {
  relativeParts,
  formatRelative,
  formatAbsoluteDate,
} from '../format/time.js';
import { ScopeList } from './ScopeList.js';

export interface AuthorityCardProps {
  readonly theme: ConsoleTheme;
  readonly t: Translator;
  readonly lang: 'en' | 'sw';
  readonly authority: Authority;
  readonly catalogue?: ReadonlyMap<string, OauthScope>;
  readonly lastUsedAt?: string | null;
  readonly onRevoke?: () => void;
  readonly onViewActivity?: () => void;
  /**
   * Hide the action footer (Revoke / View activity). Used on the History
   * tab where the authority already ended.
   */
  readonly hideActions?: boolean;
}

export function AuthorityCard(props: AuthorityCardProps): React.JSX.Element {
  const {
    theme,
    t,
    lang,
    authority,
    catalogue,
    lastUsedAt,
    onRevoke,
    onViewActivity,
    hideActions,
  } = props;
  const styles = makeStyles(theme);

  // `lang` is reserved for future tz-aware date formatting and to make the
  // component re-render when the user flips language; not yet read here.
  void lang;
  const agentName = catalogueAgentName(authority.agent_id);
  const grantedRel = relativeParts(authority.created_at);
  const expiresRel = relativeParts(authority.expires_at);
  const lastUsedRel = lastUsedAt ? relativeParts(lastUsedAt) : null;

  return (
    <View style={styles.card} accessibilityRole="summary">
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.agentName}>{agentName}</Text>
          <View style={styles.statusRow}>
            <StatusPill theme={theme} status={authority.status} t={t} />
          </View>
        </View>
      </View>

      <View style={styles.meta}>
        <MetaCell
          theme={theme}
          label={t('card.grantedOn')}
          value={formatRelative(grantedRel, t) || formatAbsoluteDate(authority.created_at)}
        />
        <MetaCell
          theme={theme}
          label={t('card.expires')}
          value={
            authority.status === 'expired'
              ? t('card.expired')
              : formatRelative(expiresRel, t) || formatAbsoluteDate(authority.expires_at)
          }
        />
        <MetaCell
          theme={theme}
          label={t('card.lastUsed')}
          value={lastUsedRel ? formatRelative(lastUsedRel, t) : t('card.never')}
        />
      </View>

      <ScopeList
        theme={theme}
        t={t}
        scopes={authority.scopes}
        {...(catalogue ? { catalogue } : {})}
      />

      {hideActions || authority.status !== 'active' ? null : (
        <View style={styles.actions}>
          {onRevoke ? (
            <Pressable
              onPress={onRevoke}
              accessibilityRole="button"
              accessibilityLabel={t('action.revoke')}
              style={({ pressed }) => [
                styles.btn,
                styles.btnRevoke,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.btnRevokeText}>{t('action.revoke')}</Text>
            </Pressable>
          ) : null}
          {onViewActivity ? (
            <Pressable
              onPress={onViewActivity}
              accessibilityRole="button"
              accessibilityLabel={t('action.viewActivity')}
              style={({ pressed }) => [
                styles.btn,
                styles.btnNeutral,
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.btnNeutralText}>{t('action.viewActivity')}</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------

interface StatusPillProps {
  readonly theme: ConsoleTheme;
  readonly status: Authority['status'];
  readonly t: Translator;
}

function StatusPill(props: StatusPillProps): React.JSX.Element {
  const { theme, status } = props;
  const { backgroundColor, color, label } = pillFor(status, theme);
  const styles = StyleSheet.create({
    pill: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
      backgroundColor,
      alignSelf: 'flex-start' as const,
    },
    text: {
      fontSize: 10,
      fontWeight: '700' as const,
      letterSpacing: 0.5,
      color,
      fontFamily: theme.typography.fontFamily,
    },
  });
  return (
    <View style={styles.pill}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

function pillFor(
  status: Authority['status'],
  theme: ConsoleTheme
): { backgroundColor: string; color: string; label: string } {
  switch (status) {
    case 'active':
      return {
        backgroundColor: theme.colors.success,
        color: theme.colors.onPrimary,
        label: 'ACTIVE',
      };
    case 'expired':
      return {
        backgroundColor: theme.colors.border,
        color: theme.colors.textMuted,
        label: 'EXPIRED',
      };
    case 'revoked':
      return {
        backgroundColor: theme.colors.danger,
        color: theme.colors.onDanger,
        label: 'REVOKED',
      };
  }
}

// ---------------------------------------------------------------------------

interface MetaCellProps {
  readonly theme: ConsoleTheme;
  readonly label: string;
  readonly value: string;
}

function MetaCell(props: MetaCellProps): React.JSX.Element {
  const { theme, label, value } = props;
  const styles = StyleSheet.create({
    cell: { flex: 1 },
    label: {
      fontSize: 10,
      letterSpacing: 1.2,
      fontWeight: '700' as const,
      color: theme.colors.textMuted,
      marginBottom: 2,
      fontFamily: theme.typography.fontFamily,
    },
    value: {
      fontSize: theme.typography.caption,
      color: theme.colors.text,
      fontWeight: '500' as const,
      fontFamily: theme.typography.fontFamily,
    },
  });
  return (
    <View style={styles.cell}>
      <Text style={styles.label} accessibilityRole="text">
        {label.toUpperCase()}
      </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * For now, the agent name comes from a simple kebab-case → Title Case
 * conversion of the agent_id (e.g. `helpan-klokd-v1` → `Helpan Klokd`).
 * When the rail surfaces a `displayName` field on the agent registry, swap
 * this out for a real lookup.
 */
function catalogueAgentName(agentId: string): string {
  const cleaned = agentId.replace(/-v\d+$/u, '');
  return cleaned
    .split('-')
    .map((s) => (s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1)))
    .join(' ');
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      gap: theme.spacing.sm,
    },
    titleBlock: { flex: 1 },
    agentName: {
      fontSize: theme.typography.title,
      fontWeight: '700' as const,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
    },
    statusRow: {
      marginTop: theme.spacing.xs,
    },
    meta: {
      flexDirection: 'row' as const,
      gap: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      borderStyle: 'dashed' as const,
      paddingVertical: theme.spacing.sm,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    actions: {
      flexDirection: 'row' as const,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    btn: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    btnPressed: { opacity: 0.85 },
    btnRevoke: { backgroundColor: theme.colors.danger },
    btnRevokeText: {
      fontSize: theme.typography.body,
      fontWeight: '700' as const,
      color: theme.colors.onDanger,
      fontFamily: theme.typography.fontFamily,
    },
    btnNeutral: { backgroundColor: theme.colors.background },
    btnNeutralText: {
      fontSize: theme.typography.body,
      fontWeight: '600' as const,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
    },
  });
}
