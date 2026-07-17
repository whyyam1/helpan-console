/**
 * Active tab screen — list of active authorities (spec §3.1).
 *
 * Renders a `ScrollView` of `AuthorityCard`s, one per active authority
 * grouped by recency (most recently granted first). Pull-to-refresh and
 * pagination-on-scroll are wired via `RefreshControl` and a near-end
 * detector; both bind to the `useConsoleData` actions surface.
 *
 * Navigation: when the user taps a card (anywhere outside the action
 * buttons) we call `onAuthorityPress` with the row; the parent decides
 * whether to open the AuthorityDetail screen. The revoke + view-activity
 * callbacks dispatch separately so tab orchestration can route them
 * differently (e.g. revoke might open a confirm modal at the parent level).
 */

import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Pressable,
} from 'react-native';
import type { Authority, OauthScope } from '../types.js';
import type { Translator } from '../i18n/index.js';
import type { ConsoleTheme } from '../theme/tokens.js';
import { AuthorityCard } from '../components/AuthorityCard.js';
import { EmptyState } from '../components/EmptyState.js';

export interface ActiveTabProps {
  readonly theme: ConsoleTheme;
  readonly t: Translator;
  readonly lang: 'en' | 'sw';
  readonly authorities: readonly Authority[];
  readonly catalogue?: ReadonlyMap<string, OauthScope>;
  readonly refreshing?: boolean;
  readonly hasMore?: boolean;
  readonly onRefresh?: () => void;
  readonly onLoadMore?: () => void;
  readonly onAuthorityPress?: (authority: Authority) => void;
  readonly onRevoke?: (authority: Authority) => void;
  readonly onViewActivity?: (authority: Authority) => void;
}

export function ActiveTab(props: ActiveTabProps): React.JSX.Element {
  const {
    theme,
    t,
    lang,
    authorities,
    catalogue,
    refreshing,
    hasMore,
    onRefresh,
    onLoadMore,
    onAuthorityPress,
    onRevoke,
    onViewActivity,
  } = props;
  const styles = makeStyles(theme);

  if (!refreshing && authorities.length === 0) {
    return (
      <View style={styles.root}>
        <EmptyState
          theme={theme}
          title={t('tab.active')}
          body={t('empty.active')}
          glyph="✓"
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
      {authorities.map((a) => (
        <Pressable
          key={a.id}
          onPress={() => onAuthorityPress?.(a)}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <AuthorityCard
            theme={theme}
            t={t}
            lang={lang}
            authority={a}
            {...(catalogue ? { catalogue } : {})}
            {...(onRevoke ? { onRevoke: () => onRevoke(a) } : {})}
            {...(onViewActivity ? { onViewActivity: () => onViewActivity(a) } : {})}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function makeStyles(theme: ConsoleTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scroll: {
      padding: theme.spacing.md,
    },
    pressed: {
      opacity: 0.92,
    },
  });
}
