"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = routeReplacement;

var _redux = require("redux");

var _reactRouter = require("react-router");

var _replaceRoutesMiddleware = require("./replaceRoutesMiddleware");

var _replaceRoutesMiddleware2 = _interopRequireDefault(_replaceRoutesMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routeReplacement(next) {
  return function (options) {
    return function (createStore) {
      return function (reducer, initialState) {
        var baseRoutes = options.routes,
            getRoutes = options.getRoutes,
            routerStateSelector = options.routerStateSelector;


        var store = void 0;

        var childRoutes = [];
        var areChildRoutesResolved = false;
        var childRoutesCallbacks = [];

        function replaceRoutes(r, isInit) {
          childRoutes = (0, _reactRouter.createRoutes)(r);

          var routerState = routerStateSelector(store.getState());
          if (routerState && !isInit) {
            var _routerState$location = routerState.location,
                state = _routerState$location.state,
                pathname = _routerState$location.pathname,
                query = _routerState$location.query;

            store.history.replace({ state: state, pathname: pathname, query: query });
          }

          if (!areChildRoutesResolved) {
            areChildRoutesResolved = true;
            childRoutesCallbacks.forEach(function (cb) {
              return cb(null, childRoutes);
            });
          }
        }

        var routes = void 0;
        if (baseRoutes) {
          routes = baseRoutes;
        } else if (getRoutes) {
          routes = getRoutes({
            dispatch: function dispatch(action) {
              return store.dispatch(action);
            },
            getState: function getState() {
              return store.getState();
            }
          });
        } else {
          routes = [{
            getChildRoutes: function getChildRoutes(location, cb) {
              if (!areChildRoutesResolved) {
                childRoutesCallbacks.push(cb);
                return;
              }

              cb(null, childRoutes);
            }
          }];
        }

        store = (0, _redux.compose)((0, _redux.applyMiddleware)((0, _replaceRoutesMiddleware2.default)(replaceRoutes)), next(_extends({}, options, {
          routes: (0, _reactRouter.createRoutes)(routes)
        })))(createStore)(reducer, initialState);

        return store;
      };
    };
  };
}