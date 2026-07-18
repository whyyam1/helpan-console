"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScopeList = ScopeList;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _scopes = require("../format/scopes.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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

function ScopeList(props) {
  const {
    theme,
    t,
    scopes,
    catalogue
  } = props;
  const styles = makeStyles(theme);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: styles.root,
    accessibilityRole: "list",
    children: scopes.map((s, idx) => {
      const limit = (0, _scopes.formatScopeLimit)(s, t);
      const behavioural = (0, _scopes.isBehaviouralScopeId)(s.scope_id, catalogue);
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: styles.row,
        accessibilityRole: "text",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          style: styles.bullet
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
          style: styles.body,
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
            style: styles.titleRow,
            children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
              style: styles.title,
              children: (0, _scopes.scopeDisplayName)(s, catalogue)
            }), behavioural ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
              style: styles.pill,
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
                style: styles.pillText,
                children: t('scope.pill.behavioural')
              })
            }) : null]
          }), limit ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: styles.limit,
            children: limit
          }) : null]
        })]
      }, `${s.scope_id}-${idx}`);
    })
  });
}
function makeStyles(theme) {
  return _reactNative.StyleSheet.create({
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