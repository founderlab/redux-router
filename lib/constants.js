"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Signals that the router's state has changed. It should
// never be called by the application, only as an implementation detail of
// redux-react-router.
var ROUTER_DID_CHANGE = exports.ROUTER_DID_CHANGE = "@@reduxReactRouter/routerDidChange";

var HISTORY_API = exports.HISTORY_API = "@@reduxReactRouter/historyAPI";
var MATCH = exports.MATCH = "@@reduxReactRouter/match";
var INIT_ROUTES = exports.INIT_ROUTES = "@@reduxReactRouter/initRoutes";
var REPLACE_ROUTES = exports.REPLACE_ROUTES = "@@reduxReactRouter/replaceRoutes";

var ROUTER_STATE_SELECTOR = exports.ROUTER_STATE_SELECTOR = "@@reduxReactRouter/routerStateSelector";

var DOES_NEED_REFRESH = exports.DOES_NEED_REFRESH = "@@reduxReactRouter/doesNeedRefresh";