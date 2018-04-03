"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reduxReactRouter;

var _redux = require("redux");

var _reactRouter = require("react-router");

var _createTransitionManager = require("react-router/lib/createTransitionManager");

var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);

var _historyMiddleware = require("./historyMiddleware");

var _historyMiddleware2 = _interopRequireDefault(_historyMiddleware);

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reduxReactRouter(_ref) {
  var routes = _ref.routes,
      createHistory = _ref.createHistory,
      parseQueryString = _ref.parseQueryString,
      stringifyQuery = _ref.stringifyQuery,
      routerStateSelector = _ref.routerStateSelector;

  return function (createStore) {
    return function (reducer, initialState) {
      var baseCreateHistory = void 0;
      if (typeof createHistory === "function") {
        baseCreateHistory = createHistory;
      } else if (createHistory) {
        baseCreateHistory = function baseCreateHistory() {
          return createHistory;
        };
      }

      var createAppHistory = (0, _reactRouter.useRouterHistory)(baseCreateHistory);

      var history = createAppHistory({
        parseQueryString: parseQueryString,
        stringifyQuery: stringifyQuery
      });

      var transitionManager = (0, _createTransitionManager2.default)(history, (0, _reactRouter.createRoutes)(routes));

      var store = (0, _redux.applyMiddleware)((0, _historyMiddleware2.default)(history))(createStore)(reducer, initialState);

      store.transitionManager = transitionManager;
      store.history = history;
      store[_constants.ROUTER_STATE_SELECTOR] = routerStateSelector;

      return store;
    };
  };
}