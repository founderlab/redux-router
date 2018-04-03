"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = historyMiddleware;

var _constants = require("./constants");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Middleware for interacting with the history API
 * @param {History} History object
 */
function historyMiddleware(history) {
  return function () {
    return function (next) {
      return function (action) {
        if (action.type === _constants.HISTORY_API) {
          var _action$payload = action.payload,
              method = _action$payload.method,
              args = _action$payload.args;

          return history[method].apply(history, _toConsumableArray(args));
        }
        return next(action);
      };
    };
  };
}