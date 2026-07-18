"use strict";

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
import { AuthorityCard } from '../components/AuthorityCard.js';
import { formatRelative, relativeParts } from '../format/time.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function AuthorityDetail(props) {
  const {
    theme,
    t,
    lang,
    authority,
    catalogue,
    actions,
    isRevoking,
    onRevoke,
    maxActions = 30
  } = props;
  const styles = makeStyles(theme);
  const own = useMemo(() => actions.filter(a => a.delegated_authority_jti === authority.id).slice(0, maxActions), [actions, authority.id, maxActions]);

  // The component re-uses AuthorityCard with hideActions; the screen owns
  // a single Revoke button at the bottom so it's always reachable below
  // the actions list (which can be long).
  void isRevoking;
  return /*#__PURE__*/_jsxs(ScrollView, {
    style: styles.root,
    contentContainerStyle: styles.scroll,
    accessibilityRole: "summary",
    children: [/*#__PURE__*/_jsx(AuthorityCard, {
      theme: theme,
      t: t,
      lang: lang,
      authority: authority,
      ...(catalogue ? {
        catalogue
      } : {}),
      ...(onRevoke ? {
        onRevoke
      } : {}),
      hideActions: authority.status !== 'active'
    }), /*#__PURE__*/_jsx(Text, {
      style: styles.section,
      children: t('tab.activity')
    }), own.length === 0 ? /*#__PURE__*/_jsx(Text, {
      style: styles.bodyMuted,
      children: t('empty.activity')
    }) : own.map(a => {
      const rel = relativeParts(a.completed_at ?? a.created_at);
      const statusKey = a.status === 'completed' ? 'status.completed' : a.status === 'failed' ? 'status.failed' : 'status.pending';
      return /*#__PURE__*/_jsxs(View, {
        style: styles.actionRow,
        children: [/*#__PURE__*/_jsx(Text, {
          style: styles.actionTitle,
          children: a.target_operation
        }), /*#__PURE__*/_jsxs(Text, {
          style: styles.actionMeta,
          children: [formatRelative(rel, t), " \xB7 ", t(statusKey), a.error_code ? ` · ${a.error_code}` : '']
        })]
      }, a.id);
    })]
  });
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
    section: {
      fontSize: theme.typography.caption,
      fontWeight: '700',
      letterSpacing: 1.4,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase',
      fontFamily: theme.typography.fontFamily
    },
    bodyMuted: {
      fontSize: theme.typography.body,
      color: theme.colors.textMuted,
      fontStyle: 'italic',
      paddingVertical: theme.spacing.md,
      fontFamily: theme.typography.fontFamily
    },
    actionRow: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.sm,
      marginBottom: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border
    },
    actionTitle: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      fontWeight: '500',
      fontFamily: theme.typography.fontFamily
    },
    actionMeta: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      marginTop: 2,
      fontFamily: theme.typography.fontFamily
    }
  });
}
//# sourceMappingURL=AuthorityDetail.js.map