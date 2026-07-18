"use strict";

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
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { AuthorityCard } from '../components/AuthorityCard.js';
import { EmptyState } from '../components/EmptyState.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function HistoryTab(props) {
  const {
    theme,
    t,
    lang,
    authorities,
    catalogue,
    refreshing,
    onRefresh
  } = props;
  const styles = makeStyles(theme);
  if (!refreshing && authorities.length === 0) {
    return /*#__PURE__*/_jsx(View, {
      style: styles.root,
      children: /*#__PURE__*/_jsx(EmptyState, {
        theme: theme,
        title: t('tab.history'),
        body: t('empty.history'),
        glyph: "\u2715"
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
    children: authorities.map(a => /*#__PURE__*/_jsxs(View, {
      children: [/*#__PURE__*/_jsx(AuthorityCard, {
        theme: theme,
        t: t,
        lang: lang,
        authority: a,
        ...(catalogue ? {
          catalogue
        } : {}),
        hideActions: true
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.reasonRow,
        accessibilityRole: "text",
        children: [/*#__PURE__*/_jsxs(Text, {
          style: styles.reasonLabel,
          children: [t('history.endedOn'), ": "]
        }), /*#__PURE__*/_jsx(Text, {
          style: styles.reasonText,
          children: reasonLine(a, t)
        })]
      })]
    }, a.id))
  });
}
function reasonLine(a, t) {
  const reasonKey = a.revocation_reason ? `reason.${a.revocation_reason}` : a.status === 'expired' ? 'reason.expired' : 'reason.other';
  return t(reasonKey);
}
function makeStyles(theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    scroll: {
      padding: theme.spacing.md
    },
    reasonRow: {
      marginTop: -theme.spacing.sm,
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center'
    },
    reasonLabel: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontWeight: '600',
      fontFamily: theme.typography.fontFamily
    },
    reasonText: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily,
      flex: 1
    }
  });
}
//# sourceMappingURL=HistoryTab.js.map