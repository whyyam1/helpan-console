"use strict";

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
import { formatScopeLimit, isBehaviouralScopeId, scopeDisplayName } from '../format/scopes.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ScopeList(props) {
  const {
    theme,
    t,
    scopes,
    catalogue
  } = props;
  const styles = makeStyles(theme);
  return /*#__PURE__*/_jsx(View, {
    style: styles.root,
    accessibilityRole: "list",
    children: scopes.map((s, idx) => {
      const limit = formatScopeLimit(s, t);
      const behavioural = isBehaviouralScopeId(s.scope_id, catalogue);
      return /*#__PURE__*/_jsxs(View, {
        style: styles.row,
        accessibilityRole: "text",
        children: [/*#__PURE__*/_jsx(View, {
          style: styles.bullet
        }), /*#__PURE__*/_jsxs(View, {
          style: styles.body,
          children: [/*#__PURE__*/_jsxs(View, {
            style: styles.titleRow,
            children: [/*#__PURE__*/_jsx(Text, {
              style: styles.title,
              children: scopeDisplayName(s, catalogue)
            }), behavioural ? /*#__PURE__*/_jsx(View, {
              style: styles.pill,
              children: /*#__PURE__*/_jsx(Text, {
                style: styles.pillText,
                children: t('scope.pill.behavioural')
              })
            }) : null]
          }), limit ? /*#__PURE__*/_jsx(Text, {
            style: styles.limit,
            children: limit
          }) : null]
        })]
      }, `${s.scope_id}-${idx}`);
    })
  });
}
function makeStyles(theme) {
  return StyleSheet.create({
    root: {
      marginTop: theme.spacing.sm
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: theme.spacing.xs,
      gap: theme.spacing.sm
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.primary,
      marginTop: 8
    },
    body: {
      flex: 1
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flexWrap: 'wrap'
    },
    title: {
      fontSize: theme.typography.body,
      color: theme.colors.text,
      fontFamily: theme.typography.fontFamily
    },
    pill: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.accent
    },
    pillText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.onPrimary,
      letterSpacing: 0.4,
      fontFamily: theme.typography.fontFamily
    },
    limit: {
      fontSize: theme.typography.caption,
      color: theme.colors.textMuted,
      marginTop: 2,
      fontFamily: theme.typography.fontFamily
    }
  });
}
//# sourceMappingURL=ScopeList.js.map