/**
 * Console scope list — used inside `AuthorityCard` and on the authority
 * detail screen (spec §3.2 / §3.3).
 *
 * Each row renders:
 *   • bullet · scope display name
 *           (and below, in muted text, the limit clause when present)
 *
 * Behavioural-data scopes get a small amber pill — same visual we used in
 * the HTML investor demo. The pill is the Console's standing visual cue
 * that the scope crossed the §4.2 friction screen at grant time.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { AuthorityScope, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
import {
  formatScopeLimit,
  isBehaviouralScopeId,
  scopeDisplayName,
} from '../format/scopes.js';
import type { ConsoleTheme } from '../theme/tokens.js';

export interface ScopeListProps {
  readonly theme: ConsoleTheme;
  readonly t: Translator;
  readonly scopes: readonly AuthorityScope[];
  readonly catalogue?: ReadonlyMap<string, OauthScope>;
}

export function ScopeList(props: ScopeListProps): React.JSX.Element {
  const { theme, t, scopes, catalogue } = props;
  const styles = makeStyles(theme);
  return (
    <View style={styles.root} accessibilityRole="list">
      {scopes.map((s, idx) => {
        const limit = formatScopeLimit(s, t);
        const behavioural = isBehaviouralScopeId(s.scope_id, catalogue);
        return (
          <View
            key={`${s.scope_id}-${idx}`}
            style={styles.row}
            accessibilityRole="text"
          >
            <View style={styles.bullet} />
            <View style={styles.body}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{scopeDisplayName(s, catalogue)}</Text>
                {behavioural ? (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>
                      {t('scope.pill.behavioural')}
                    </Text>
                  </View>
                ) : null}
              </View>
              {limit ? <Text style={styles.limit}>{limit}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: {
      marginTop: theme.spacing.sm,
    },
    row: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      paddingVertical: theme.spacing.xs,
      gap: theme.spacing.sm,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.primary,
      marginTop: 8,
    },
    body: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing.sm,
      flexWrap: 'wrap' as const,
    },
    title: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily,
    },
    pill: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.accent,
    },
    pillText: {
      fontSize: 10,
      fontWeight: '700' as const,
      color: theme.colors.onPrimary,
      letterSpacing: 0.4,
      fontFamily: theme.typography.fontFamily,
    },
    limit: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      marginTop: 2,
      fontFamily: theme.typography.fontFamily,
    },
  });
}
