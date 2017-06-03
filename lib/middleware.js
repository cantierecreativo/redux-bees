'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var middleware = function middleware() {
  return function (next) {
    return function (promise) {
      if (promise.type === '@BEESNOOP') {
        return;
      }

      if (!promise.then) {
        return next(promise);
      }

      var meta = {
        api: true,
        name: promise.actionName,
        params: promise.params
      };

      next({
        type: 'api/' + promise.actionName + '/request',
        meta: _extends({}, meta, { type: 'request' })
      });

      return promise.then(function (result) {
        next({
          type: 'api/' + promise.actionName + '/response',
          payload: result,
          meta: _extends({}, meta, { type: 'response' })
        });
        return Promise.resolve(result);
      }).catch(function (result) {
        next({
          type: 'api/' + promise.actionName + '/error',
          payload: result,
          meta: _extends({}, meta, { type: 'error' })
        });
        return Promise.reject(result);
      });
    };
  };
};

exports.default = middleware;