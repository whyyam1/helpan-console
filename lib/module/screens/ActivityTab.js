"use strict";

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
import { View, Text, ScrollView, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { EmptyState } from '../components/EmptyState.js';
import { formatRelative, relativeParts } from '../format/time.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ActivityTab(props) {
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
    onActionPress
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
    return /*#__PURE__*/_jsx(View, {
      style: styles.root,
      children: /*#__PURE__*/_jsx(EmptyState, {
        theme: theme,
        title: t('tab.activity'),
        body: t('empty.activity'),
        glyph: "\u2022"
      })
    });
  }
  return /*#__PURE__*/_jsx(ScrollView, {
    style: styles.root,
    contentContainerStyle: styles.scroll,
    refreshControl: onRefresh ? /*#__PURE__*/_jsx(RefreshControl, {
      refreshing: refreshing === true,
      onRefresh: onRefresh,
      tintColor: theme.colors.primary
    }) : undefined,
    onScroll: ({
      nativeEvent
    }) => {
      if (!onLoadMore || !hasMore) return;
      const {
        contentOffset,
        contentSize,
        layoutMeasurement
      } = nativeEvent;
      const distanceToEnd = contentSize.height - contentOffset.y - layoutMeasurement.height;
      if (distanceToEnd < 240) onLoadMore();
    },
    scrollEventThrottle: 200,
    children: actions.map(a => /*#__PURE__*/_jsx(Row, {
      theme: theme,
      t: t,
      action: a,
      onPress: onActionPress ? () => onActionPress(a) : undefined
    }, a.id))
  });
}

// ---------------------------------------------------------------------------

function Row(props) {
  const {
    theme,
    t,
    action,
    onPress
  } = props;
  const styles = rowStyles(theme);
  const occurred = action.completed_at ?? action.created_at;
  const relParts = relativeParts(occurred);
  const statusKey = action.status === 'completed' ? 'status.completed' : action.status === 'failed' ? 'status.failed' : 'status.pending';
  return /*#__PURE__*/_jsx(Pressable, {
    onPress: onPress,
    disabled: !onPress,
    style: ({
      pressed
    }) => [styles.row, pressed && styles.pressed],
    accessibilityRole: onPress ? 'button' : 'text',
    children: /*#__PURE__*/_jsxs(View, {
      style: styles.body,
      children: [/*#__PURE__*/_jsx(Text, {
        style: styles.title,
        children: humanOperation(action.target_operation)
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.metaRow,
        children: [/*#__PURE__*/_jsx(Text, {
          style: styles.metaAgent,
          children: action.agent_id
        }), /*#__PURE__*/_jsx(Text, {
          style: styles.metaDot,
          children: " \xB7 "
        }), /*#__PURE__*/_jsx(Text, {
          style: styles.metaTime,
          children: formatRelative(relParts, t)
        }), /*#__PURE__*/_jsx(Text, {
          style: styles.metaDot,
          children: " \xB7 "
        }), /*#__PURE__*/_jsx(Text, {
          style: [styles.metaStatus, action.status === 'failed' ? styles.metaStatusFail : styles.metaStatusOk],
          children: t(statusKey)
        })]
      }), action.status === 'failed' && action.error_code ? /*#__PURE__*/_jsx(Text, {
        style: styles.errorCode,
        children: action.error_code
      }) : null]
    })
  });
}

/**
 * Light cosmetic transform of `klokd.write.shift_pay` →
 * `klokd · write · shift pay`. The Console doesn't have access to the
 * scope catalogue display names for the operation column; this gives the
 * user something readable until the catalogue lookup is added (parity
 * with how `formatScopeLimit` uses `scope_id` as a fallback name).
 */
function humanOperation(op) {
  return op.replaceAll('_', ' ').replaceAll('.', ' · ');
}
function makeStyles(theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    scroll: {
      padding: theme.spacing.md
    }
  });
}
function rowStyles(theme) {
  return StyleSheet.create({
    row: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    pressed: {
      opacity: 0.92
    },
    body: {
      flex: 1
    },
    title: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
      fontFamily: theme.typography.fontFamily
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 4
    },
    metaAgent: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily
    },
    metaDot: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted
    },
    metaTime: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily
    },
    metaStatus: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.5,
      fontFamily: theme.typography.fontFamily
    },
    metaStatusOk: {
      color: theme.colors.success
    },
    metaStatusFail: {
      color: theme.colors.danger
    },
    errorCode: {
      marginTop: 4,
      fontSize: theme.typography.caption,
      color: theme.colors.danger,
      fontFamily: theme.typography.fontFamily
    }
  });
}
//# sourceMappingURL=ActivityTab.js.map