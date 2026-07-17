/**
 * Activity tab — agent action log (spec §3.4).
 *
 * Reverse-chronological list. Each row shows agent + operation + status +
 * timestamp. Failed actions surface the error_code below the title in
 * muted text. The list is loaded lazily — the parent calls
 * `actions.loadActivity()` the first time this tab is opened (the hook
 * does not auto-load on mount, by design).
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Pressable,
} from 'react-native';
import type { ConsoleAction } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
import { EmptyState } from '../components/EmptyState.js';
import { formatRelative, relativeParts } from '../format/time.js';

export interface ActivityTabProps {
  readonly theme: ConsoleTheme;
  readonly t: Translator;
  readonly actions: readonly ConsoleAction[];
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly refreshing?: boolean;
  readonly hasMore?: boolean;
  /** Called once on mount when the list is still `idle`. */
  readonly onFirstOpen?: () => void;
  readonly onRefresh?: () => void;
  readonly onLoadMore?: () => void;
  readonly onActionPress?: (action: ConsoleAction) => void;
}

export function ActivityTab(props: ActivityTabProps): React.JSX.Element {
  const {
    theme,
    t,
    actions,
    status,
    refreshing,
    hasMore,
    onFirstOpen,
    onRefresh,
    onLoadMore,
    onActionPress,
  } = props;
  const styles = makeStyles(theme);

  // Lazy first-load — calls back once when the parent hasn't pre-loaded.
  useEffect(() => {
    if (status === 'idle') onFirstOpen?.();
    // We intentionally depend only on `status`; if the parent flips status
    // back to idle (rare), we re-trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!refreshing && status === 'ready' && actions.length === 0) {
    return (
      <View style={styles.root}>
        <EmptyState
          theme={theme}
          title={t('tab.activity')}
          body={t('empty.activity')}
          glyph="•"
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
      onScroll={({ nativeEvent }) => {
        if (!onLoadMore || !hasMore) return;
        const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
        const distanceToEnd =
          contentSize.height - contentOffset.y - layoutMeasurement.height;
        if (distanceToEnd < 240) onLoadMore();
      }}
      scrollEventThrottle={200}
    >
      {actions.map((a) => (
        <Row
          key={a.id}
          theme={theme}
          t={t}
          action={a}
          onPress={onActionPress ? () => onActionPress(a) : undefined}
        />
      ))}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------

interface RowProps {
  readonly theme: ConsoleTheme;
  readonly t: Translator;
  readonly action: ConsoleAction;
  readonly onPress?: (() => void) | undefined;
}

function Row(props: RowProps): React.JSX.Element {
  const { theme, t, action, onPress } = props;
  const styles = rowStyles(theme);
  const occurred = action.completed_at ?? action.created_at;
  const relParts = relativeParts(occurred);
  const statusKey =
    action.status === 'completed'
      ? 'status.completed'
      : action.status === 'failed'
        ? 'status.failed'
        : 'status.pending';
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <View style={styles.body}>
        <Text style={styles.title}>{humanOperation(action.target_operation)}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaAgent}>{action.agent_id}</Text>
          <Text style={styles.metaDot}> · </Text>
          <Text style={styles.metaTime}>{formatRelative(relParts, t)}</Text>
          <Text style={styles.metaDot}> · </Text>
          <Text
            style={[
              styles.metaStatus,
              action.status === 'failed' ? styles.metaStatusFail : styles.metaStatusOk,
            ]}
          >
            {t(statusKey as Parameters<Translator>[0])}
          </Text>
        </View>
        {action.status === 'failed' && action.error_code ? (
          <Text style={styles.errorCode}>{action.error_code}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Light cosmetic transform of `klokd.write.shift_pay` →
 * `klokd · write · shift pay`. The Console doesn't have access to the
 * scope catalogue display names for the operation column; this gives the
 * user something readable until the catalogue lookup is added (parity
 * with how `formatScopeLimit` uses `scope_id` as a fallback name).
 */
function humanOperation(op: string): string {
  return op.replaceAll('_', ' ').replaceAll('.', ' · ');
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { padding: theme.spacing.md },
  });
}

function rowStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    row: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pressed: { opacity: 0.92 },
    body: { flex: 1 },
    title: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600' as const,
      fontFamily: theme.typography.fontFamily,
    },
    metaRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      flexWrap: 'wrap' as const,
      marginTop: 4,
    },
    metaAgent: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily,
    },
    metaDot: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
    },
    metaTime: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily,
    },
    metaStatus: {
      fontSize: 10,
      fontWeight: '700' as const,
      letterSpacing: 0.5,
      fontFamily: theme.typography.fontFamily,
    },
    metaStatusOk: { color: theme.colors.success },
    metaStatusFail: { color: theme.colors.danger },
    errorCode: {
      marginTop: 4,
      fontSize: theme.typography.caption,
      color: theme.colors.danger,
      fontFamily: theme.typography.fontFamily,
    },
  });
}
