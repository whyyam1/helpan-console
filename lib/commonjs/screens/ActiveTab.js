"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActiveTab = ActiveTab;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _AuthorityCard = require("../components/AuthorityCard.js");
var _EmptyState = require("../components/EmptyState.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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

function ActiveTab(props) {
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
    onViewActivity
  } = props;
  const styles = makeStyles(theme);
  if (!refreshing && authorities.length === 0) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
      style: styles.root,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_EmptyState.EmptyState, {
        theme: theme,
        title: t('tab.active'),
        body: t('empty.active'),
        glyph: "\u2713"
      })
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ScrollView, {
    style: styles.root,
    contentContainerStyle: styles.scroll,
    refreshControl: onRefresh ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.RefreshControl, {
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
    children: authorities.map(a => /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
      onPress: () => onAuthorityPress?.(a),
      style: ({
        pressed
      }) => pressed && styles.pressed,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_AuthorityCard.AuthorityCard, {
        theme: theme,
        t: t,
        lang: lang,
        authority: a,
        ...(catalogue ? {
          catalogue
        } : {}),
        ...(onRevoke ? {
          onRevoke: () => onRevoke(a)
        } : {}),
        ...(onViewActivity ? {
          onViewActivity: () => onViewActivity(a)
        } : {})
      })
    }, a.id))
  });
}
function makeStyles(theme) {
  return _reactNative.StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    scroll: {
      padding: theme.spacing.md
    },
    pressed: {
      opacity: 0.92
    }
  });
}
//# sourceMappingURL=ActiveTab.js.map