"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ActiveTab", {
  enumerable: true,
  get: function () {
    return _ActiveTab.ActiveTab;
  }
});
Object.defineProperty(exports, "ActivityTab", {
  enumerable: true,
  get: function () {
    return _ActivityTab.ActivityTab;
  }
});
Object.defineProperty(exports, "AuthorityCard", {
  enumerable: true,
  get: function () {
    return _AuthorityCard.AuthorityCard;
  }
});
Object.defineProperty(exports, "AuthorityDetail", {
  enumerable: true,
  get: function () {
    return _AuthorityDetail.AuthorityDetail;
  }
});
Object.defineProperty(exports, "BehaviouralFrictionScreen", {
  enumerable: true,
  get: function () {
    return _BehaviouralFrictionScreen.BehaviouralFrictionScreen;
  }
});
Object.defineProperty(exports, "ConsoleApiClient", {
  enumerable: true,
  get: function () {
    return _client.ConsoleApiClient;
  }
});
Object.defineProperty(exports, "ConsoleApiError", {
  enumerable: true,
  get: function () {
    return _client.ConsoleApiError;
  }
});
Object.defineProperty(exports, "EmptyState", {
  enumerable: true,
  get: function () {
    return _EmptyState.EmptyState;
  }
});
Object.defineProperty(exports, "GrantFlow", {
  enumerable: true,
  get: function () {
    return _GrantFlow.GrantFlow;
  }
});
Object.defineProperty(exports, "HelpanConsole", {
  enumerable: true,
  get: function () {
    return _HelpanConsole.HelpanConsole;
  }
});
Object.defineProperty(exports, "HistoryTab", {
  enumerable: true,
  get: function () {
    return _HistoryTab.HistoryTab;
  }
});
Object.defineProperty(exports, "OfflineBanner", {
  enumerable: true,
  get: function () {
    return _OfflineBanner.OfflineBanner;
  }
});
Object.defineProperty(exports, "RevokeConfirmModal", {
  enumerable: true,
  get: function () {
    return _RevokeConfirmModal.RevokeConfirmModal;
  }
});
Object.defineProperty(exports, "ScopeList", {
  enumerable: true,
  get: function () {
    return _ScopeList.ScopeList;
  }
});
Object.defineProperty(exports, "Tabs", {
  enumerable: true,
  get: function () {
    return _Tabs.Tabs;
  }
});
Object.defineProperty(exports, "consoleReducer", {
  enumerable: true,
  get: function () {
    return _reducer.consoleReducer;
  }
});
Object.defineProperty(exports, "createTranslator", {
  enumerable: true,
  get: function () {
    return _index.createTranslator;
  }
});
Object.defineProperty(exports, "defaultTheme", {
  enumerable: true,
  get: function () {
    return _tokens.defaultTheme;
  }
});
Object.defineProperty(exports, "formatAbsoluteDate", {
  enumerable: true,
  get: function () {
    return _time.formatAbsoluteDate;
  }
});
Object.defineProperty(exports, "formatMoneyMinor", {
  enumerable: true,
  get: function () {
    return _money.formatMoneyMinor;
  }
});
Object.defineProperty(exports, "formatRelative", {
  enumerable: true,
  get: function () {
    return _time.formatRelative;
  }
});
Object.defineProperty(exports, "formatScopeLimit", {
  enumerable: true,
  get: function () {
    return _scopes.formatScopeLimit;
  }
});
Object.defineProperty(exports, "initialConsoleState", {
  enumerable: true,
  get: function () {
    return _reducer.initialConsoleState;
  }
});
Object.defineProperty(exports, "isBehaviouralScope", {
  enumerable: true,
  get: function () {
    return _types.isBehaviouralScope;
  }
});
Object.defineProperty(exports, "isBehaviouralScopeId", {
  enumerable: true,
  get: function () {
    return _scopes.isBehaviouralScopeId;
  }
});
Object.defineProperty(exports, "isRevoking", {
  enumerable: true,
  get: function () {
    return _reducer.isRevoking;
  }
});
Object.defineProperty(exports, "isSupportedLang", {
  enumerable: true,
  get: function () {
    return _index.isSupportedLang;
  }
});
Object.defineProperty(exports, "relativeParts", {
  enumerable: true,
  get: function () {
    return _time.relativeParts;
  }
});
Object.defineProperty(exports, "resolveTheme", {
  enumerable: true,
  get: function () {
    return _tokens.resolveTheme;
  }
});
Object.defineProperty(exports, "scopeDisplayName", {
  enumerable: true,
  get: function () {
    return _scopes.scopeDisplayName;
  }
});
Object.defineProperty(exports, "selectActive", {
  enumerable: true,
  get: function () {
    return _reducer.selectActive;
  }
});
Object.defineProperty(exports, "selectHistory", {
  enumerable: true,
  get: function () {
    return _reducer.selectHistory;
  }
});
Object.defineProperty(exports, "useConsoleData", {
  enumerable: true,
  get: function () {
    return _useConsoleData.useConsoleData;
  }
});
var _types = require("./types.js");
var _client = require("./api/client.js");
var _index = require("./i18n/index.js");
var _tokens = require("./theme/tokens.js");
var _money = require("./format/money.js");
var _time = require("./format/time.js");
var _scopes = require("./format/scopes.js");
var _reducer = require("./state/reducer.js");
var _AuthorityCard = require("./components/AuthorityCard.js");
var _ScopeList = require("./components/ScopeList.js");
var _RevokeConfirmModal = require("./components/RevokeConfirmModal.js");
var _BehaviouralFrictionScreen = require("./components/BehaviouralFrictionScreen.js");
var _EmptyState = require("./components/EmptyState.js");
var _OfflineBanner = require("./components/OfflineBanner.js");
var _Tabs = require("./components/Tabs.js");
var _ActiveTab = require("./screens/ActiveTab.js");
var _ActivityTab = require("./screens/ActivityTab.js");
var _HistoryTab = require("./screens/HistoryTab.js");
var _AuthorityDetail = require("./screens/AuthorityDetail.js");
var _GrantFlow = require("./screens/GrantFlow.js");
var _useConsoleData = require("./hooks/useConsoleData.js");
var _HelpanConsole = require("./HelpanConsole.js");
//# sourceMappingURL=index.js.map