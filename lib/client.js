"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require("redux");

var _actionCreators = require("./actionCreators");

var _routerStateEquals = require("./routerStateEquals");

var _routerStateEquals2 = _interopRequireDefault(_routerStateEquals);

var _reduxReactRouter = require("./reduxReactRouter");

var _reduxReactRouter2 = _interopRequireDefault(_reduxReactRouter);

var _useDefaults = require("./useDefaults");

var _useDefaults2 = _interopRequireDefault(_useDefaults);

var _routeReplacement = require("./routeReplacement");

var _routeReplacement2 = _interopRequireDefault(_routeReplacement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function historySynchronization(next) {
  return function (options) {
    return function (createStore) {
      return function (reducer, initialState) {
        var onError = options.onError,
            routerStateSelector = options.routerStateSelector;

        var store = next(options)(createStore)(reducer, initialState);
        var history = store.history,
            transitionManager = store.transitionManager;


        var prevRouterState = void 0;
        var routerState = void 0;

        transitionManager.listen(function (error, nextRouterState) {
          if (error) {
            onError(error);
            return;
          }

          if (!(0, _routerStateEquals2.default)(routerState, nextRouterState)) {
            prevRouterState = routerState;
            routerState = nextRouterState;
            store.dispatch((0, _actionCreators.routerDidChange)(nextRouterState));
          }
        });

        store.subscribe(function () {
          var nextRouterState = routerStateSelector(store.getState());

          if (nextRouterState && prevRouterState !== nextRouterState && !(0, _routerStateEquals2.default)(routerState, nextRouterState)) {
            routerState = nextRouterState;
            var _nextRouterState$loca = nextRouterState.location,
                state = _nextRouterState$loca.state,
                pathname = _nextRouterState$loca.pathname,
                query = _nextRouterState$loca.query;

            history.replace({ state: state, pathname: pathname, query: query });
          }
        });

        return store;
      };
    };
  };
}

exports.default = (0, _redux.compose)(_useDefaults2.default, _routeReplacement2.default, historySynchronization)(_reduxReactRouter2.default);