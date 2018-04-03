"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isActive;

var _isActive2 = require("react-router/lib/isActive");

var _isActive3 = _interopRequireDefault(_isActive2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a router state selector that returns whether or not the given
 * pathname and query are active.
 * @param {String} pathname
 * @param {Object} query
 * @param {Boolean} indexOnly
 * @return {Boolean}
 */
function isActive(pathname, query) {
  var indexOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  return function (state) {
    if (!state) return false;
    var location = state.location,
        params = state.params,
        routes = state.routes;

    return (0, _isActive3.default)({ pathname: pathname, query: query }, indexOnly, location, routes, params);
  };
}