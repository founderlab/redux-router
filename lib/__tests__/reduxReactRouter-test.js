"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ = require("../");

var _constants = require("../constants");

var _redux = require("redux");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require("react-router");

var _createMemoryHistory = require("history/lib/createMemoryHistory");

var _createMemoryHistory2 = _interopRequireDefault(_createMemoryHistory);

var _useBasename = require("history/lib/useBasename");

var _useBasename2 = _interopRequireDefault(_useBasename);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = _react2.default.createElement(
  _reactRouter.Route,
  { path: "/" },
  _react2.default.createElement(
    _reactRouter.Route,
    { path: "parent" },
    _react2.default.createElement(_reactRouter.Route, { path: "child/:id" })
  )
);

describe("reduxRouter()", function () {
  it("adds router state to Redux store", function () {
    var reducer = (0, _redux.combineReducers)({
      router: _.routerStateReducer
    });

    var store = (0, _.reduxReactRouter)({
      createHistory: _createMemoryHistory2.default,
      routes: routes
    })(_redux.createStore)(reducer);

    var history = store.history;

    var historySpy = _sinon2.default.spy();
    history.listen(function () {
      return historySpy();
    });

    expect(historySpy.callCount).to.equal(0);

    store.dispatch((0, _.push)({ pathname: "/parent" }));
    expect(store.getState().router.location.pathname).to.equal("/parent");
    expect(historySpy.callCount).to.equal(1);

    store.dispatch((0, _.push)({ pathname: "/parent/child/123", query: { key: "value" } }));
    expect(historySpy.callCount).to.equal(2);
    expect(store.getState().router.location.pathname).to.equal("/parent/child/123");
    expect(store.getState().router.location.query).to.eql({ key: "value" });
    expect(store.getState().router.params).to.eql({ id: "123" });
  });

  it("detects external router state changes", function () {
    var baseReducer = (0, _redux.combineReducers)({
      router: _.routerStateReducer
    });

    var EXTERNAL_STATE_CHANGE = "EXTERNAL_STATE_CHANGE";

    var externalState = {
      location: {
        pathname: "/parent/child/123",
        query: { key: "value" },
        key: "lolkey"
      }
    };

    var reducerSpy = _sinon2.default.spy();
    function reducer(state, action) {
      reducerSpy();

      if (action.type === EXTERNAL_STATE_CHANGE) {
        return _extends({}, state, { router: action.payload });
      }

      return baseReducer(state, action);
    }

    var history = (0, _createMemoryHistory2.default)();
    var historySpy = _sinon2.default.spy();

    var historyState = void 0;
    history.listen(function (s) {
      historySpy();
      historyState = s;
    });

    var store = (0, _.reduxReactRouter)({
      history: history,
      routes: routes
    })(_redux.createStore)(reducer);

    expect(reducerSpy.callCount).to.equal(2);
    expect(historySpy.callCount).to.equal(0);

    store.dispatch({
      type: EXTERNAL_STATE_CHANGE,
      payload: externalState
    });

    expect(reducerSpy.callCount).to.equal(4);
    expect(historySpy.callCount).to.equal(1);
    expect(historyState.pathname).to.equal("/parent/child/123");
    expect(historyState.search).to.equal("?key=value");
  });

  it("works with navigation action creators", function () {
    var reducer = (0, _redux.combineReducers)({
      router: _.routerStateReducer
    });

    var store = (0, _.reduxReactRouter)({
      createHistory: _createMemoryHistory2.default,
      routes: routes
    })(_redux.createStore)(reducer);

    store.dispatch((0, _.push)({ pathname: "/parent/child/123", query: { key: "value" } }));
    expect(store.getState().router.location.pathname).to.equal("/parent/child/123");
    expect(store.getState().router.location.query).to.eql({ key: "value" });
    expect(store.getState().router.params).to.eql({ id: "123" });

    store.dispatch((0, _.replace)({ pathname: "/parent/child/321", query: { key: "value2" } }));
    expect(store.getState().router.location.pathname).to.equal("/parent/child/321");
    expect(store.getState().router.location.query).to.eql({ key: "value2" });
    expect(store.getState().router.params).to.eql({ id: "321" });
  });

  it("doesn't interfere with other actions", function () {
    var APPEND_STRING = "APPEND_STRING";

    function stringBuilderReducer() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var action = arguments[1];

      if (action.type === APPEND_STRING) {
        return state + action.string;
      }
      return state;
    }

    var reducer = (0, _redux.combineReducers)({
      router: _.routerStateReducer,
      string: stringBuilderReducer
    });

    var history = (0, _createMemoryHistory2.default)();

    var store = (0, _.reduxReactRouter)({
      history: history,
      routes: routes
    })(_redux.createStore)(reducer);

    store.dispatch({ type: APPEND_STRING, string: "Uni" });
    store.dispatch({ type: APPEND_STRING, string: "directional" });
    expect(store.getState().string).to.equal("Unidirectional");
  });

  it("stores the latest state in routerState", function () {
    var reducer = (0, _redux.combineReducers)({
      router: _.routerStateReducer
    });

    var history = (0, _createMemoryHistory2.default)();

    var store = (0, _.reduxReactRouter)({
      history: history,
      routes: routes
    })(_redux.createStore)(reducer);

    var historyState = void 0;
    history.listen(function (s) {
      historyState = s;
    });

    store.dispatch((0, _.push)({ pathname: "/parent" }));

    store.dispatch({
      type: _constants.REPLACE_ROUTES
    });

    historyState = null;

    store.dispatch({ type: "RANDOM_ACTION" });
    expect(historyState).to.equal(null);
  });

  it("handles async middleware", function (done) {
    var reducer = (0, _redux.combineReducers)({
      router: _.routerStateReducer
    });

    var history = (0, _createMemoryHistory2.default)();
    var historySpy = _sinon2.default.spy();

    history.listen(function () {
      return historySpy();
    });
    expect(historySpy.callCount).to.equal(0);

    (0, _redux.compose)((0, _.reduxReactRouter)({
      history: history,
      routes: routes
    }), (0, _redux.applyMiddleware)(function () {
      return function (next) {
        return function (action) {
          return setTimeout(function () {
            return next(action);
          }, 0);
        };
      };
    }))(_redux.createStore)(reducer);

    history.push({ pathname: "/parent" });
    expect(historySpy.callCount).to.equal(1);

    setTimeout(function () {
      expect(historySpy.callCount).to.equal(1);
      done();
    }, 0);
  });

  it("accepts history object when using basename", function () {
    var reducer = (0, _redux.combineReducers)({
      router: _.routerStateReducer
    });

    var history = (0, _useBasename2.default)(_createMemoryHistory2.default)({
      basename: "/grandparent"
    });

    var store = (0, _.reduxReactRouter)({
      history: history,
      routes: routes
    })(_redux.createStore)(reducer);

    store.dispatch((0, _.push)({ pathname: "/parent" }));
    expect(store.getState().router.location.pathname).to.eql("/parent");

    store.dispatch((0, _.push)({ pathname: "/parent/child/123", query: { key: "value" } }));
    expect(store.getState().router.location.pathname).to.eql("/parent/child/123");
    expect(store.getState().router.location.basename).to.eql("/grandparent");
    expect(store.getState().router.location.query).to.eql({ key: "value" });
    expect(store.getState().router.params).to.eql({ id: "123" });
  });

  describe("getRoutes()", function () {
    it("is passed dispatch and getState", function () {
      var reducer = (0, _redux.combineReducers)({
        router: _.routerStateReducer
      });

      var store = void 0;
      var history = (0, _createMemoryHistory2.default)();

      (0, _.reduxReactRouter)({
        history: history,
        getRoutes: function getRoutes(s) {
          store = s;
          return routes;
        }
      })(_redux.createStore)(reducer);

      store.dispatch((0, _.push)({ pathname: "/parent/child/123", query: { key: "value" } }));
      expect(store.getState().router.location.pathname).to.equal("/parent/child/123");
    });
  });

  describe("onEnter hook", function () {
    it("can perform redirects", function () {
      var reducer = (0, _redux.combineReducers)({
        router: _.routerStateReducer
      });

      var history = (0, _createMemoryHistory2.default)();

      var requireAuth = function requireAuth(nextState, redirect) {
        redirect({ pathname: "/login" });
      };

      var store = (0, _.reduxReactRouter)({
        history: history,
        routes: _react2.default.createElement(
          _reactRouter.Route,
          { path: "/" },
          _react2.default.createElement(
            _reactRouter.Route,
            { path: "parent" },
            _react2.default.createElement(_reactRouter.Route, { path: "child/:id", onEnter: requireAuth })
          ),
          _react2.default.createElement(_reactRouter.Route, { path: "login" })
        )
      })(_redux.createStore)(reducer);

      store.dispatch((0, _.push)({ pathname: "/parent/child/123", query: { key: "value" } }));
      expect(store.getState().router.location.pathname).to.equal("/login");
    });

    describe("isActive", function () {
      it("creates a selector for whether a pathname/query pair is active", function () {
        var reducer = (0, _redux.combineReducers)({
          router: _.routerStateReducer
        });

        var history = (0, _createMemoryHistory2.default)();

        var store = (0, _.reduxReactRouter)({
          history: history,
          routes: routes
        })(_redux.createStore)(reducer);

        var activeSelector = (0, _.isActive)("/parent", { key: "value" });
        expect(activeSelector(store.getState().router)).to.be.false;
        store.dispatch((0, _.push)({ pathname: "/parent", query: { key: "value" } }));
        expect(activeSelector(store.getState().router)).to.be.true;
      });
    });
  });
});