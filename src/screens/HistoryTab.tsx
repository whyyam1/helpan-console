/**
 * History tab — revoked / expired authorities (spec §3.5).
 *
 * Same `AuthorityCard` component as Active, but rendered with
 * `hideActions=true` and a reason chip below the status pill ("You revoked
 * this" / "Expired" / "Revoked because your account was suspended"). The
 * reason copy comes from the i18n catalogue keyed on
 * `authority.revocation_reason`, with `expired` as a synthetic fallback
 * when `status='expired'` and there's no explicit reason.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import type { Authority, OauthScope } from '../types.js';
import type { Translator, MessageKey } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
import { AuthorityCard } from '../components/AuthorityCard.js';
import { EmptyState } from '../components/EmptyState.js';

export interface HistoryTabProps {
  readonly theme: ConsoleTheme;
  readonly t: Translator;
  readonly lang: 'en' | 'sw';
  readonly authorities: readonly Authority[];
  readonly catalogue?: ReadonlyMap<string, OauthScope>;
  readonly refreshing?: boolean;
  readonly onRefresh?: () => void;
}

export function HistoryTab(props: HistoryTabProps): React.JSX.Element {
  const { theme, t, lang, authorities, catalogue, refreshing, onRefresh } = props;
  const styles = makeStyles(theme);

  if (!refreshing && authorities.length === 0) {
    return (
      <View style={styles.root}>
        <EmptyState
          theme={theme}
          title={t('tab.history')}
          body={t('empty.history')}
          glyph="✕"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scroll}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing === true}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        ) : undefined
      }
    >
      {authorities.map((a) => (
        <View key={a.id}>
          <AuthorityCard
            theme={theme}
            t={t}
            lang={lang}
            authority={a}
            {...(catalogue ? { catalogue } : {})}
            hideActions
          />
          <View style={styles.reasonRow} accessibilityRole="text">
            <Text style={styles.reasonLabel}>{t('history.endedOn')}: </Text>
            <Text style={styles.reasonText}>{reasonLine(a, t)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function reasonLine(a: Authority, t: Translator): string {
  const reasonKey = (
    a.revocation_reason
      ? `reason.${a.revocation_reason}`
      : a.status === 'expired'
        ? 'reason.expired'
        : 'reason.other'
  ) as MessageKey;
  return t(reasonKey);
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { padding: theme.spacing.md },
    reasonRow: {
      marginTop: -theme.spacing.sm,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    reasonLabel: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontWeight: '600' as const,
      fontFamily: theme.typography.fontFamily,
    },
    reasonText: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily,
      flex: 1,
    },
  });
}
